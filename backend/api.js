exports.setApp = function (app, client) {
  const jwt = require("jsonwebtoken");
  const accessTokenSecret = process.env.SECRET_KEY;

  function authenticateToken(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      return res.sendStatus(401); // if there isn't any token
    }

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      req.user = user;
      next(); // pass the execution off to whatever request the client intended
    });
  }
  app.post("/api/register", async (req, res, next) => {
    // incoming: firstName, lastName, login, password, email, address1, address2
    // outgoing: error, success

    const { login } = req.body;

    const db = client.db();

    try {
      const results = await db
        .collection("Users")
        .find({ login: login })
        .toArray();

      if (results.length > 0 && results[0].validated) {
        var ret = { error: "Login is already in use", success: false };
        res.status(400).json(ret);
      } else {
        if (results.length > 0 && !results[0].validated) {
          var uid = require("mongodb").ObjectID(results[0]._id);
          db.collection("Users").deleteOne({ _id: uid });
        }

        var error = "";
        var validateCode = Math.random()
          .toString(36)
          .substring(2, 12)
          .toUpperCase();
        const {
          firstName,
          lastName,
          login,
          password,
          email,
          address1,
          address2,
        } = req.body;
        const newUser = {
          firstName: firstName,
          lastName: lastName,
          login: login,
          password: password,
          email: email,
          address1: address1,
          address2: address2,
          validated: false,
          validExpire: null,
          validateCode: validateCode,
        };

        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        var emailMsg =
          "To start using your Giftree wishlist account, please verify your email address by clicking the link below ";
        emailMsg +=
          "or enter the code below into the validation page in the app: <br/><br/> Validation code: " +
          validateCode;
        emailMsg +=
          '<br/><br/> <a href = "https://giftree.herokuapp.com/token?v=' +
          validateCode +
          '"> https://giftree.herokuapp.com/token?v=' +
          validateCode +
          "</a>";
        emailMsg += "<br/><br/>Thank you,<br/>Giftree App Team";

        const msg = {
          to: email, // Recipient
          from: "giftreewishlist@gmail.com", // Sender
          subject: "Please verify your Giftree wishlist account",
          html: emailMsg,
        };
        sgMail.send(msg);

        const result = db.collection("Users").insertOne(newUser);
        var ret = { error: "", success: true };

        res.status(200).json(ret);
      }
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/getUser", authenticateToken, async (req, res, next) => {
    // incoming: userId
    // outgoing: firstName, lastName, login, email, address1 , address2, error, success

    var error = "";
    const { userId } = req.body;
    const db = client.db();

    try {
      var uid = require("mongodb").ObjectID(userId);
      const results = await db.collection("Users").find({ _id: uid }).toArray();

      if (results.length < 1) {
        var ret = { error: "User not found", success: false };
        res.status(400).json(ret);
      } else {
        var user = results[0];
        var ret = {};

        ret.firstName = user.firstName;
        ret.lastName = user.lastName;
        ret.login = user.login;
        ret.email = user.email;
        ret.address1 = user.address1;
        ret.address2 = user.address2;
        ret.error = "";
        ret.success = true;
        res.status(200).json(ret);
      }
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/updateUser", authenticateToken, async (req, res, next) => {
    // incoming: userId, firstName, lastName, login, password, email, address1 , address2
    // outgoing: error, success

    var error = "";
    const {
      userId,
      firstName,
      lastName,
      login,
      password,
      email,
      address1,
      address2,
    } = req.body;
    const db = client.db();

    try {
      var uid = require("mongodb").ObjectID(userId);
      if (password == undefined || password == "") {
        db.collection("Users").update(
          { _id: uid },
          {
            $set: {
              firstName: firstName,
              lastName: lastName,
              login: login,
              email: email,
              address1: address1,
              address2: address2,
            },
          }
        );
      } else {
        db.collection("Users").update(
          { _id: uid },
          {
            $set: {
              firstName: firstName,
              lastName: lastName,
              login: login,
              password: password,
              email: email,
              address1: address1,
              address2: address2,
            },
          }
        );
      }
      var ret = { error: "", success: true };

      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/deleteUser", authenticateToken, async (req, res, next) => {
    // incoming: userId
    // outoing: error, success

    var error = "";
    const { userId } = req.body;
    const db = client.db();
    try {
      var uid = require("mongodb").ObjectID(userId);

      const results = await db
        .collection("Groups")
        .find({ members: userId })
        .toArray();

      if (results.length > 0) {
        var ret = { error: "User is in an active group", success: false };
        res.status(400).json(ret);
      } else {
        const deleteGifts = db
          .collection("Gifts")
          .deleteMany({ userId: userId });
        const deleteUser = db.collection("Users").deleteOne({ _id: uid });

        var ret = { error: "", success: true };

        res.status(200).json(ret);
      }
    } catch {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/validate", async (req, res, next) => {
    // incoming: login, password, validateCode
    // outgoing: userId, firstName, lastName, error, success

    var error = "";

    const { login, password, validateCode } = req.body;

    const db = client.db();
    try {
      const results = await db
        .collection("Users")
        .find({
          login: login,
          password: password,
          validated: false,
          validateCode: validateCode,
        })
        .toArray();

      if (results.length > 0) {
        const valid = db
          .collection("Users")
          .update(
            { login: login, password: password, validateCode: validateCode },
            { $set: { validated: true } }
          );
        var user = results[0];
        var ret = {};

        ret.userId = user._id;
        ret.firstName = user.firstName;
        ret.lastName = user.lastName;
        ret.error = "";
        ret.success = true;
        res.status(200).json(ret);
      } else {
        var ret = { error: "User not found", success: false };
        res.status(400).json(ret);
      }
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/login", async (req, res, next) => {
    // incoming: login, password
    // outgoing: userId, firstName, lastName, error, success

    var error = "";

    const { login, password } = req.body;

    const db = client.db();
    try {
      const results = await db
        .collection("Users")
        .find({ login: login, password: password })
        .toArray();

      if (results.length > 0) {
        var user = results[0];
        if (user.validated) {
          const expiresIn = 24 * 60 * 60;
          const accessToken = jwt.sign(
            { username: results[0].username },
            accessTokenSecret,
            { expiresIn: expiresIn }
          );

          var ret = {};
          ret.userId = user._id;
          ret.firstName = user.firstName;
          ret.lastName = user.lastName;
          ret.accessToken = accessToken;
          ret.expiresIn = expiresIn;
          ret.error = "";
          ret.success = true;
          res.status(200).json(ret);
        } else {
          var ret = { error: "User not Validated", success: false };
          res.status(400).json(ret);
        }
      } else {
        var ret = { error: "User not found", success: false };
        res.status(400).json(ret);
      }
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/forgotPasswordRequest", async (req, res, next) => {
    // incoming: login
    // outgoing: error, success

    var error = "";
    const { login } = req.body;
    const db = client.db();

    try {
      const results = await db
        .collection("Users")
        .find({ login: login })
        .toArray();

      if (results.length > 0) {
        var email = results[0].email;

        var uid = require("mongodb").ObjectID(results[0]._id);
        var validateCode = Math.random()
          .toString(36)
          .substring(2, 12)
          .toUpperCase();
        var expire = new Date();
        expire.setHours(expire.getHours() + 1);

        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        var emailMsg = "<h1>Here's your Giftree Password Reset!</h1><br/><br/>";
        emailMsg +=
          "<strong>You are receiving this email because you requested a password reset. </strong> ";
        emailMsg +=
          "If you did not request this, please disregard this email. <br/><br/>";
        emailMsg +=
          "You can reset your password by entering the validation code in the app, or by clicking the link below<br/><br/>";
        emailMsg = +"Validation code: " + validateCode + "<br/><br/>";
        emailMsg +=
          '<a href = "https://giftree.herokuapp.com/validate?v=' +
          validateCode +
          '"> https://giftree.herokuapp.com/validate?v=' +
          validateCode +
          "</a>";
        emailMsg += "<br/><br/>Thank you,<br/>Giftree App Team";

        const msg = {
          to: email, // Recipient
          from: "giftreewishlist@gmail.com", // Sender
          subject: "Giftree wishlist Password Reset",
          html: emailMsg,
        };
        sgMail.send(msg);

        const result = db
          .collection("Users")
          .update(
            { _id: uid },
            { $set: { validExpire: expire, validateCode: validateCode } }
          );
      }

      var ret = { error: "", success: true };
      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/forgotPasswordReset", async (req, res, next) => {
    // incoming: login, password, validateCode
    // outgoing: error, success

    var error = "";
    const { login, password, validateCode } = req.body;
    const db = client.db();

    try {
      const results = await db
        .collection("Users")
        .find({ login: login, validateCode: validateCode })
        .toArray();

      if (results.length < 1) {
        var ret = { error: "User not found", success: false };
        res.status(400).json(ret);
      } else {
        var user = results[0];
        var today = new Date();
        var expire = new Date(user.validExpire);

        if (today > expire) {
          var ret = {
            error: "Password reset validation code expired",
            success: false,
          };
          res.status(400).json(ret);
        } else {
          var uid = require("mongodb").ObjectID(user._id);
          const update = db
            .collection("Users")
            .update({ _id: uid }, { $set: { password: password } });

          var ret = { error: "", success: true };
          res.status(200).json(ret);
        }
      }
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/addGroup", authenticateToken, async (req, res, next) => {
    // incoming: userId, groupName
    // outgoing: error, success, groupCode

    const { userId, groupName } = req.body;

    const db = client.db();

    const newGroup = {
      groupName: groupName,
      members: [userId],
      event: false,
      eventName: null,
      eventPriceMin: null,
      eventPriceMax: null,
      eventDate: null,
      secretShopper_buyers: [null],
      secretShopper_receivers: [null],
    };

    try {
      var uniqueGroupCode = false;
      var groupCode, code;
      while (!uniqueGroupCode) {
        groupCode = Math.random().toString(36).substring(2, 12).toUpperCase();

        code = await db
          .collection("Groups")
          .find({ groupCode: groupCode })
          .toArray();
        uniqueGroupCode = code.length == 0;
      }

      newGroup.groupCode = groupCode;

      const result = db.collection("Groups").insertOne(newGroup);
      var ret = { error: "", success: true, groupCode: groupCode };

      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/getGroups", authenticateToken, async (req, res, next) => {
    // incoming: userId
    // outgoing: groups[groupId, groupName], error, success

    const { userId } = req.body;

    const db = client.db();
    try {
      const results = await db
        .collection("Groups")
        .find({ members: userId })
        .project({ groupName: 1, groupCode: 1 })
        .toArray();

      var groups = [];

      for (i = 0; i < results.length; i++) {
        groups.push({
          groupId: results[i]._id,
          groupName: results[i].groupName,
        });
      }

      var ret = { groups: groups, error: "", success: true };
      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/getGroupInfo", authenticateToken, async (req, res, next) => {
    // incoming: groupId, userId
    // outgoing: groupName, groupCode, event, eventName, eventPriceMin, eventPriceMax, eventDate, secretShopper_receiver{userId, firstName, lastName},
    // members[firstName, lastName, userId], error, success

    const { groupId, userId } = req.body;
    var gid = require("mongodb").ObjectID(groupId);

    const db = client.db();
    try {
      const results = await db
        .collection("Groups")
        .find({ _id: gid })
        .toArray();

      if (results.length < 1) {
        var ret = { error: "Group not found", success: false };
        res.status(400).json(ret);
      } else {
        var group = results[0];
        var members = results[0].members;
        var len = members.length;

        var index = -1;
        for (i = 0; i < len; i++) {
          if (members[i] == userId) index = i;
        }

        if (index == -1) {
          var ret = { error: "User not in group", success: false };
          res.status(400).json(ret);
        } else {
          var receiverInfo = {};
          if (group.event) {
            id = group.secretShopper_receivers[index];
            var uid = require("mongodb").ObjectID(id);
            const receiver = await db
              .collection("Users")
              .find({ _id: uid })
              .project({ firstName: 1, lastName: 1 })
              .toArray();
            receiverInfo = {
              userId: receiver[0]._id,
              firstName: receiver[0].firstName,
              lastName: receiver[0].lastName,
            };
          }

          var memberList = [];

          for (j = 0; j < len; j++) {
            var uid = require("mongodb").ObjectID(members[j]);
            var member = await db
              .collection("Users")
              .find({ _id: uid })
              .project({ firstName: 1, lastName: 1 })
              .toArray();
            memberList.push({
              userId: member[0]._id,
              firstName: member[0].firstName,
              lastName: member[0].lastName,
            });
          }

          var ret = {};
          ret.groupName = group.groupName;
          ret.groupCode = group.groupCode;
          ret.event = group.event;
          ret.eventName = group.eventName;
          ret.eventPriceMin = group.eventPriceMin;
          ret.eventPriceMax = group.eventPriceMax;
          ret.eventDate = group.eventDate;
          ret.secretShopper_receiver = receiverInfo;
          ret.members = memberList;
          ret.error = "";
          ret.success = true;

          res.status(200).json(ret);
        }
      }
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/userAddGroup", authenticateToken, async (req, res, next) => {
    // incoming: groupCode, userId
    // outgoing: error, success

    const { groupCode, userId } = req.body;

    const db = client.db();
    try {
      const groupCheck = await db
        .colllection("Groups")
        .find({ groupCode:groupCode })
        .toArray();
      
        if (groupCheck.length < 1) {
        var ret = {
            error: "Group not found",
            success: false,
          };
          res.status(400).json(ret);          
      }
      else {
        const check = await db
            .collection("Groups")
            .find({ groupCode: groupCode, members: userId })
            .toArray();

        if (check.length > 0) {
            var ret = {
            error: "User is already a member of this group",
            success: false,
            };
            res.status(400).json(ret);
        } else {
            const results = db
            .collection("Groups")
            .update({ groupCode: groupCode }, { $addToSet: { members: userId } });
            var ret = { error: "", success: true };

            res.status(200).json(ret);
        }
      }
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post(
    "/api/deleteGroupMember",
    authenticateToken,
    async (req, res, next) => {
      // incoming: groupId, userId
      // outgoing: error, success

      const { groupId, userId } = req.body;
      var gid = require("mongodb").ObjectID(groupId);

      const db = client.db();

      try {
        const results = db
          .collection("Groups")
          .update({ _id: gid }, { $pull: { members: userId } });
        var ret = { error: "", success: true };

        res.status(200).json(ret);
      } catch (e) {
        var error = e.toString();
        res.status(500).json({ success: false, error: error });
      }
    }
  );

  app.post(
    "/api/updateGroupName",
    authenticateToken,
    async (req, res, next) => {
      // incoming: groupId, groupName
      // outgoing: error, success

      const { groupId, groupName } = req.body;
      var gid = require("mongodb").ObjectID(groupId);

      const db = client.db();

      try {
        const results = db
          .collection("Groups")
          .update({ _id: gid }, { $set: { groupName: groupName } });
        var ret = { error: "", success: true };

        res.status(200).json(ret);
      } catch (e) {
        var error = e.toString();
        res.status(500).json({ success: false, error: error });
      }
    }
  );

  app.post("/api/deleteGroup", authenticateToken, async (req, res, next) => {
    // incoming: groupId
    // outgoing: error, success

    const { groupId } = req.body;
    var gid = require("mongodb").ObjectID(groupId);

    const db = client.db();

    try {
      const results = db.collection("Groups").deleteOne({ _id: gid });
      var ret = { error: "", success: true };

      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/addEvent", authenticateToken, async (req, res, next) => {
    // incoming: groupId, eventName, eventPriceMin, eventPriceMax, eventDate
    // outgoing: error, success

    const {
      groupId,
      eventName,
      eventPriceMin,
      eventPriceMax,
      eventDate,
    } = req.body;
    var gid = require("mongodb").ObjectID(groupId);

    const db = client.db();

    var buyers = [];
    var receivers = [];

    try {
      const groups = await db
        .collection("Groups")
        .find({ _id: gid })
        .project({ members: 1 })
        .toArray();

      if (groups.length < 1) {
        var ret = { error: "Group not found", success: false };
        res.status(400).json(ret);
      } else {
        const members = groups[0].members;

        for (i = 0; i < members.length; i++) {
          buyers.push(members[i]);
          receivers.push(members[i]);
        }

        if (members.length > 1) {
          var matched = true;
          while (matched) {
            receivers.sort(() => Math.random() - 0.5);
            matched = false;
            for (j = 0; j < buyers.length; j++) {
              if (buyers[j] == receivers[j]) matched = true;
            }
          }
        }

        const results = db.collection("Groups").update(
          { _id: gid },
          {
            $set: {
              event: true,
              eventName: eventName,
              eventPriceMin: eventPriceMin,
              eventPriceMax: eventPriceMax,
              eventDate: eventDate,
              secretShopper_receivers: receivers,
            },
          }
        );
        var ret = { error: "", success: true };

        res.status(200).json(ret);
      }
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/deleteEvent", authenticateToken, async (req, res, next) => {
    // incoming: groupId
    // outgoing: error, success

    const { groupId } = req.body;
    var gid = require("mongodb").ObjectID(groupId);

    const db = client.db();
    try {
      const results = db.collection("Groups").update(
        { _id: gid },
        {
          $set: {
            event: false,
            eventName: null,
            eventPriceMin: null,
            eventPriceMax: null,
            eventDate: null,
            secretShopper_buyers: [null],
            secretShopper_receivers: [null],
          },
        }
      );
      var ret = { error: "", success: true };

      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/getWishlist", authenticateToken, async (req, res, next) => {
    // incoming: userId
    // outgoing: gifts[giftId, giftName, giftPrice, giftGot], error, success

    const { userId } = req.body;

    const db = client.db();
    try {
      const results = await db
        .collection("Gifts")
        .find({ userId: userId })
        .project({ giftName: 1, giftPrice: 1, giftGot: 1 })
        .toArray();

      var gifts = [];

      for (i = 0; i < results.length; i++) {
        gifts.push({
          giftId: results[i]._id,
          giftName: results[i].giftName,
          giftPrice: results[i].giftPrice,
          giftGot: results[i].giftGot,
        });
      }

      var ret = { gifts: gifts, error: "", success: true };
      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/addGift", authenticateToken, async (req, res, next) => {
    // incoming: userId, giftName, giftPrice, giftLocation, giftComment
    // outgoing: error, success

    const { userId, giftName, giftPrice, giftLocation, giftComment } = req.body;
    const db = client.db();
    const newGift = {
      userId: userId,
      giftName: giftName,
      giftPrice: giftPrice,
      giftLocation: giftLocation,
      giftComment: giftComment,
      giftGot: false,
    };

    try {
      const result = db.collection("Gifts").insertOne(newGift);
      var ret = { error: "", success: true };

      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/getGift", authenticateToken, async (req, res, next) => {
    // incoming: giftId
    // outgoing: giftName, giftPrice, giftLocation, giftComment, giftGot, error, success

    const { giftId } = req.body;
    var gid = require("mongodb").ObjectID(giftId);

    const db = client.db();
    try {
      const results = await db.collection("Gifts").find({ _id: gid }).toArray();

      if (results.length > 0) {
        var gift = results[0];
        var ret = {};
        ret.giftName = gift.giftName;
        ret.giftPrice = gift.giftPrice;
        ret.giftLocation = gift.giftLocation;
        ret.giftComment = gift.giftComment;
        ret.giftGot = gift.giftGot;
        ret.error = "";
        ret.success = true;

        res.status(200).json(ret);
      } else {
        var ret = { error: "No Gifts found", success: false };
        res.status(400).json(ret);
      }
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/UpdateGift", authenticateToken, async (req, res, next) => {
    // incoming: giftId, giftName, giftPrice, giftLocation, giftComment
    // outgoing: error, success

    const { giftId, giftName, giftPrice, giftLocation, giftComment } = req.body;
    var gid = require("mongodb").ObjectID(giftId);

    const db = client.db();
    try {
      const results = db.collection("Gifts").update(
        { _id: gid },
        {
          $set: {
            giftName: giftName,
            giftPrice: giftPrice,
            giftLocation: giftLocation,
            giftComment: giftComment,
          },
        }
      );
      var ret = { error: "", success: true };

      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/deleteGift", authenticateToken, async (req, res, next) => {
    // incoming: giftId
    // outgoing: error, success

    const { giftId } = req.body;
    var gid = require("mongodb").ObjectID(giftId);

    const db = client.db();
    try {
      const results = db.collection("Gifts").deleteOne({ _id: gid });
      var ret = { error: "", success: true };

      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/gotGift", authenticateToken, async (req, res, next) => {
    // incoming: giftId
    // outgoing: error, success

    const { giftId } = req.body;
    var gid = require("mongodb").ObjectID(giftId);

    const db = client.db();
    try {
      const gotStatus = await db
        .collection("Gifts")
        .find({ _id: gid })
        .project({ giftGot: 1 })
        .toArray();
      if (gotStatus.length > 0) {
        var gotUpdate = !gotStatus[0].giftGot;

        const results = db
          .collection("Gifts")
          .update({ _id: gid }, { $set: { giftGot: gotUpdate } });
      }

      var ret = { error: "", success: true };
      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });
};
