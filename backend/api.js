exports.setApp = function (app, client) {
  app.post("/api/register", async (req, res, next) => {
    // incoming: firstName, lastName, username, password, email, address1, address2
    // outgoing: error, success

    const { login } = req.body;

    const db = client.db();
    const results = await db
      .collection("Users")
      .find({ login: login })
      .toArray();

    if (results.length > 0) {
      var ret = { error: "Error: Login is already in use", success: false };
      res.status(400).json(ret);
    } else {
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
        validateCode: validateCode,
      };

      try {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        var emailMsg =
          "To start using your giftree wishlist account, please verify your email address by clicking the link below ";
        emailMsg +=
          "or enter the code below into the validation page in the app: </br></br> Validation code: " +
          validateCode;
        emailMsg +=
          '</br></br> <a href = "https://website.com/validate?v=' +
          validateCode +
          '"> https://website.com/validate?v=' +
          validateCode +
          "</a>";

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
      } catch (e) {
        var error = e.toString();
        res.status(500).json({ success: false, error: error });
      }
    }
  });

  app.post("/api/validate", async (req, res, next) => {
    // incoming: username, password, validateCode
    // outgoing: userId, firstName, lastName, error, success

    var error = "";

    const { login, password, validateCode } = req.body;

    const db = client.db();
    try {
      const results = await db
        .collection("Users")
        .find({ login: login, password: password, validateCode: validateCode })
        .toArray();

      if (results.length > 0) {
        const valid = db
          .collection("Users")
          .update(
            { login: login, password: password, validateCode: validateCode },
            { $set: { validated: true } }
          );

        var ret = {};
        ret.userId = results[0]._id;
        ret.firstName = results[0].firstName;
        ret.lastName = results[0].lastName;
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
    // incoming: username, password
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
        if (results[0].validated) {
          var ret = {};
          ret.userId = results[0]._id;
          ret.firstName = results[0].firstName;
          ret.lastName = results[0].lastName;
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

  app.post("/api/addGroup", async (req, res, next) => {
    // incoming: userId, groupName
    // outgoing: error, success

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
      var ret = { error: "", success: true };

      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/getGroups", async (req, res, next) => {
    // incoming: userId
    // outgoing: groups[groupId, groupName, groupCode], error, success

    const { userId } = req.body;

    const db = client.db();
    try {
      const results = await db
        .collection("Groups")
        .find({ members: userId }, { groupName: 1, groupCode: 1 })
        .toArray();

      var groups = [];

      for (i = 0; i < results.length; i++) {
        groups.push({
          groupId: results[i]._id,
          groupName: results[i].groupName,
          groupCode: results[i].groupCode,
        });
      }

      var ret = { groups: groups, error: "", success: true };
      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/getGroupInfo", async (req, res, next) => {
    // incoming: groupId
    // outgoing: event, eventName, eventPriceMin, eventPriceMax, eventDate, secretShopper_buyers, secretShopper_receivers, members[firstName, lastName, userId], error, success

    const { groupId } = req.body;
    var gid = require("mongodb").ObjectID(groupId);

    const db = client.db();
    try {
      const results = await db
        .collection("Groups")
        .find({ _id: gid })
        .toArray();

      if (results.length > 0) {
        var ret = {};
        ret.event = results[0].event;
        ret.eventName = results[0].eventName;
        ret.eventPriceMin = results[0].eventPriceMin;
        ret.eventPriceMax = results[0].eventPriceMax;
        ret.eventDate = results[0].eventDate;
        ret.secretShopper_buyers = results[0].secretShopper_buyers;
        ret.secretShopper_receivers = results[0].secretShopper_receivers;
        ret.members = results[0].members;
        ret.error = "";
        ret.success = true;

        res.status(200).json(ret);
      } else {
        var ret = { error: "Group not found", success: false };
        res.status(400).json(ret);
      }
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  /*   app.post('/api/addGroupMember', async (req, res, next) =>
    {
        // incoming: groupId, userId
        // outgoing: error, success

        const { groupId, userId} = req.body;
        var gid = require('mongodb').ObjectID(groupId);

        const db = client.db();
        const results = await db.collection('Groups').update({ _id:gid }, { $addToSet: { members:userId } });


    });
    */

  app.post("/api/userAddGroup", async (req, res, next) => {
    // incoming: groupCode, userId
    // outgoing: error, success

    const { groupCode, userId } = req.body;

    const db = client.db();
    try {
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
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });

  app.post("/api/deleteGroupMember", async (req, res, next) => {
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
  });

  app.post("/api/updateGroupName", async (req, res, next) => {
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
  });

  app.post("/api/deleteGroup", async (req, res, next) => {
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

  app.post("/api/addEvent", async (req, res, next) => {
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
        .find({ _id: gid }, { members: 1 })
        .toArray();
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

      const results = db
        .collection("Groups")
        .update(
          { _id: gid },
          {
            $set: {
              event: true,
              eventName: eventName,
              eventPriceMin: eventPriceMin,
              eventPriceMax: eventPriceMax,
              eventDate: eventDate,
              secretShopper_buyers: buyers,
              secretShopper_receivers: receivers,
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

  app.post("/api/deleteEvent", async (req, res, next) => {
    // incoming: groupId
    // outgoing: error, success

    const { groupId } = req.body;
    var gid = require("mongodb").ObjectID(groupId);

    const db = client.db();
    try {
      const results = db
        .collection("Groups")
        .update(
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

  app.post("/api/getWishlist", async (req, res, next) => {
    // incoming: userId
    // outgoing: gifts[giftId, giftName, giftPrice, giftGot], error, success

    const { userId } = req.body;

    const db = client.db();
    try {
      const results = await db
        .collection("Gifts")
        .find({ userId: userId }, { giftName: 1, giftPrice: 1, giftGot: 1 })
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

  app.post("/api/addGift", async (req, res, next) => {
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

  app.post("/api/getGift", async (req, res, next) => {
    // incoming: giftId
    // outgoing: giftName, giftPrice, giftLocation, giftComment, giftGot, error, success

    const { giftId } = req.body;
    var gid = require("mongodb").ObjectID(giftId);

    const db = client.db();
    try {
      const results = await db.collection("Gifts").find({ _id: gid }).toArray();

      if (results.length > 0) {
        var ret = {};
        ret.giftName = results[0].giftName;
        ret.giftPrice = results[0].giftPrice;
        ret.giftLocation = results[0].giftLocation;
        ret.giftComment = results[0].giftComment;
        ret.giftGot = results[0].giftGot;
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

  app.post("/api/UpdateGift", async (req, res, next) => {
    // incoming: giftId, giftName, giftPrice, giftLocation, giftComment
    // outgoing: error, success

    const { giftId, giftName, giftPrice, giftLocation, giftComment } = req.body;
    var gid = require("mongodb").ObjectID(giftId);

    const db = client.db();
    try {
      const results = db
        .collection("Gifts")
        .update(
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

  app.post("/api/deleteGift", async (req, res, next) => {
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

  app.post("/api/gotGift", async (req, res, next) => {
    // incoming: giftId
    // outgoing: error, success

    const { giftId } = req.body;
    var gid = require("mongodb").ObjectID(giftId);

    const db = client.db();
    try {
      const gotStatus = await db
        .collection("Gifts")
        .find({ _id: gid }, { giftGot: 1 })
        .toArray();
      var gotUpdate = !gotStatus[0].giftGot;

      const results = db
        .collection("Gifts")
        .update({ _id: gid }, { $set: { giftGot: gotUpdate } });
      var ret = { error: "", success: true };

      res.status(200).json(ret);
    } catch (e) {
      var error = e.toString();
      res.status(500).json({ success: false, error: error });
    }
  });
};
