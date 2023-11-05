import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage(){
    const [orders,setOrders]=useState([]);
    useEffect(()=> {
        axios.get('/api/orders').then(response => {
           setOrders(response.data);
        })
    }, []);
    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Date</td>
                        <td>Paid</td>
                        <td>Recipient</td>
                        <td>Products</td>
                    </tr>
                </thead>

                <tbody>
                    {orders.length > 0 && orders.map(order=>(
                        <tr>
                            {/* <td>{order.createdAt.replace('T', ' ').substring(0,19)}</td> */}
                            <td>{(new Date(order.createdAt)).toLocaleString()}</td>
                            <td className={order.paid ? 'text-green-600' : 'text-red-700'}>{order.paid ? 
                            <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="float-left w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>&nbsp;YES</> 
                            : 
                            <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class=" float-left w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>&nbsp;NO</>
                            }</td>

                          {/*   <td className={order.paid ? 'text-green-600' : 'text-red-600'}>{order.paid ? 'YES' : 'NO'} </td> */}
                            
                            <td>
                                {order.name}<br />
                                {order.email} {order.phoneNumber}<br />
                                {order.city} {order.postalCode} {order.streetAddress}<br />
                                {order.country}<br/>
                            </td>

                            <td>
                                {order.line_items.map(line=>(
                                <>
                                {line.price_data?.product_data?.name} x {line.quantity}<br/>
                                {/* {JSON.stringify(line)}<br/> */}

                                </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}