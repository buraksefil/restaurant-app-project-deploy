import React, { useState, useEffect } from "react";
import axios from "axios";
import Coupon from "../../../../components/Coupon/Coupon";
import { Link } from "react-router-dom";
import { FaTrashCan } from "react-icons/fa6"
import { FaPen } from "react-icons/fa6"

const url = process.env.REACT_APP_SERVER_URL || "http://localhost:80"

function CouponPageList() {
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        axios.get(`${url}/discounts/coupons`).then((response) => {
            setCoupons(response.data);
            console.log(response.data)
        });
    }, []);

    function deleteItem(id) {
        axios.delete(`${url}/discounts/coupons/${id}`).then((response) => {
            setCoupons((prevItems) => prevItems.filter((coupon) => coupon._id !== id));
        });
    }

    return (
        <div>
            <h1>Cupões</h1>
            <div className="page-container">
                <table className="centered-table">
                    <thead>
                        <tr>
                            <th>Code Coupon</th>
                            <th className="w-60">Data Inicial</th>
                            <th className="w-60">Data de Expiração</th>
                            <th colSpan="2">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon._id}>
                                <td><Coupon coupon={coupon} /></td>
                                <td>{coupon.start}</td>
                                <td>{coupon.end}</td>
                                <td><Link to={`/editCoupon/${coupon._id}`}><button className="button-acoes-edit"><FaPen /></button></Link></td>
                                <td><button className="button-acoes-delete" onClick={() => deleteItem(coupon._id)}><FaTrashCan /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}

export default CouponPageList;
