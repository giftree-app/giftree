import React, { Component } from 'react';
import {Gift} from '../models/Gift';

interface GiftProps extends Gift, Component{ };
  
const GiftTable:React.FC<GiftProps> = (props) => {
    const {giftId, giftName, giftPrice, giftLocation, giftComment, giftGot } = props;

    return (
        <tbody>
            <tr>
                <td>
                    {props.giftId}
                </td>
                <td>
                    {props.giftName}
                </td>
                <td>
                    {props.giftPrice}
                </td>
                <td>
                    {props.giftGot}
                </td>
            </tr>
        </tbody>
    );
}

export default GiftTable;