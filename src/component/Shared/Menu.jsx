import React, { useState, useContext, useEffect } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { AuthContext } from "../context/Auth";

const menu = [
  {
    item: "Khách hàng",
    link: "/customer",
    permission: "Nhân Viên"
  },
  {
    item: "Mã giảm giá",
    link: "/coupon",
    permission: "Nhân Viên"
  },
  {
    item: "Sản phẩm",
    link: "/product",
    permission: "Nhân Viên"
  },
  {
    item: "Giảm giá",
    link: "/sale",
    permission: "Nhân Viên"
  },
  {
    item: "Danh mục sản phẩm",
    link: "/category",
    permission: "Nhân Viên"
  },
  {
    item: "Đơn hàng",
    link: "/order",
    permission: "Nhân Viên"
  },
  {
    item: "Xác nhận đơn hàng",
    link: "/confirmorder",
    permission: "Nhân Viên"
  },
  {
    item: "Vận chuyển",
    link: "/delivery",
    permission: "Nhân Viên"
  },
  {
    item: "Xác nhận vận chuyển",
    link: "/confirmdelivery",
    permission: "Nhân Viên"
  },
  {
    item: "Hoàn thành đơn hàng",
    link: "/completedorder",
    permission: "Nhân Viên"
  },
  {
    item: "Hủy đơn hàng",
    link: "/cancelorder",
    permission: "Nhân Viên"
  },
  {
    item: "Nhân viên",
    link: "/user",
    permission: "Admin"
  },
  {
    item: "Quản lý quyền",
    link: "/permission",
    permission: "Admin"
  }
  // "Category", ,
  // "Permission",
  // "User",
  // "Order",
  // "ConfirmOrder",
  // "Delivery",
  // "ConfirmDelivery",
  // "CompletedOrder",
  // "CancelOrder"
];
function Menu() {
  const { user, jwt } = useContext(AuthContext);
  return (
    <div>
      {jwt && user ? (
        <aside className="left-sidebar" data-sidebarbg="skin6">
          <div className="scroll-sidebar" data-sidebarbg="skin6">
            <nav className="sidebar-nav">
              <ul id="sidebarnav">
                <li className="list-divider"></li>

                <li className="nav-small-cap">
                  <span className="hide-menu">Danh mục</span>
                </li>

                <li className="sidebar-item">
                  <a
                    className="sidebar-link has-arrow"
                    href="#"
                    aria-expanded="false"
                  >
                    <i data-feather="grid" className="feather-icon"></i>
                    <span className="hide-menu">Danh mục chính</span>
                  </a>
                  <ul
                    aria-expanded="false"
                    className="collapse first-level base-level-line overflow-auto"
                    style={{ maxHeight: "400px" }}
                  >
                    {menu &&
                      menu.map((item, index) => (
                        <li className="sidebar-item active" key={index}>
                          {item.permission === user.id_permission.permission ? (
                            <NavLink to={item.link} className="sidebar-link">
                              {item.item}
                            </NavLink>
                          ) : (
                            <div></div>
                          )}
                        </li>
                      ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
      ) : (
        <Redirect to="/" />
      )}
    </div>
  );
}

export default Menu;
