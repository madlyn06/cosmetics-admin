/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import queryString from "query-string";

import orderAPI from "../Api/orderAPI";
import Pagination from "../Shared/Pagination";
import DatePicker from "react-datepicker";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
// import faker from "faker";
import "react-datepicker/dist/react-datepicker.css";
import Chart from "./Chart";
import axiosClient from "../Api/axiosClient";
import "./style.css";
function CompletedOrder(props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState({
    plugins: {
      title: {
        display: true,
        text: "Thông kê từ ngày 1/1/2024 đến ngày 1/1/2025"
      }
    },
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          display: false
        }
      },
      y: {
        stacked: true
      }
    }
  });
  const [filter, setFilter] = useState({
    page: "1",
    limit: "10",
    getDate: ""
  });
  const [dates, setDates] = useState({
    start: new Date(),
    end: new Date()
  });

  const [order, setOrder] = useState([]);
  const [totalPage, setTotalPage] = useState();
  const [totalMoney, setTotalMoney] = useState();
  const [data, setData] = useState([]);
  useEffect(() => {
    const query = "?" + queryString.stringify(filter);

    const fetchAllData = async () => {
      const od = await orderAPI.completeOrder(query);
      setTotalPage(od.totalPage);
      setOrder(od.orders);
      setTotalMoney(od.totalMoney);
    };
    fetchAllData();
  }, [filter]);

  const onPageChange = (value) => {
    setFilter({
      ...filter,
      page: value
    });
  };

  const handler_Report = () => {
    // source code HTML table to PDF

    var sTable = document.getElementById("customers").innerHTML;

    var style = "<style>";
    style = style + "table {width: 100%;font: 17px Calibri;}";
    style =
      style +
      "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
    style = style + "padding: 2px 3px;text-align: center;}";
    style = style + "</style>";

    // CREATE A WINDOW OBJECT.
    var win = window.open("", "", "height=900,width=1000");

    win.document.write("<html><head>");
    win.document.write("<title>Profile</title>"); // <title> FOR PDF HEADER.
    win.document.write(style); // ADD STYLE INSIDE THE HEAD TAG.
    win.document.write("</head>");
    win.document.write("<body>");
    win.document.write(sTable); // THE TABLE CONTENTS INSIDE THE BODY TAG.
    win.document.write("</body></html>");

    win.document.close(); // CLOSE THE CURRENT WINDOW.

    win.print(); // PRINT THE CONTENTS.
  };

  const [errMessage, setErrMessage] = useState("");
  const [subMessage, setSubMessage] = useState("");

  const handlerTopProduct = async (e) => {
    const result = await axiosClient.get(`/admin/order/month`);
    setOptions({
      ...options,
      plugins: {
        title: {
          display: true,
          text: "Thống kê top 5 sản phẩm bán chạy"
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            display: false
          }
        },
        y: {
          stacked: true
        }
      }
    });
    const dataChart = {
      labels: result.map((item) => item.name),
      datasets: [
        {
          label: "Dataset 1",
          data: result.map((item) => item.totalCount),
          backgroundColor: "rgb(255, 99, 132)",
          stack: "Stack 0"
        }
      ]
    };
    setData(dataChart);
    setOpen(true);
  };

  const handlerStatistic = async (e) => {
    e.preventDefault();
    setOptions({
      ...options,
      plugins: {
        title: {
          display: true,
          text: `Thông kê từ ${dates.start} đến ${dates.end}`
        }
      }
    });
    const result = await axiosClient.get(
      `/admin/order/statistical?start=${dates.start}&end=${dates.end}`
    );
    const dataChart = {
      labels: result.map((item) => item._id),
      datasets: [
        {
          label: "Dataset 1",
          data: result.map((item) => item.totalSum),
          backgroundColor: "rgb(255, 99, 132)",
          stack: "Stack 0"
        }
      ]
    };
    setData(dataChart);
    setOpen(true);
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Đơn hàng đã hoàn thành</h4>
                <div className="table-responsive mt-3" id="customers">
                  <table
                    className="table table-striped table-bordered no-wrap"
                    id="tab_customers"
                  >
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên người nhận</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th>Tổng tiền</th>
                        <th>Phương thức thanh toán</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>

                    <tbody>
                      {order &&
                        order.map((value, index) => (
                          <tr key={index}>
                            <td className="name">{value._id}</td>
                            <td className="name">{value.id_note.fullname}</td>
                            <td className="name">{value.id_user.email}</td>
                            <td className="name">{value.id_note.phone}</td>
                            <td className="name">{value.address}</td>
                            <td>
                              {(() => {
                                switch (value.status) {
                                  case "1":
                                    return "Đang xử lý";
                                  case "2":
                                    return "Đã xác nhận";
                                  case "3":
                                    return "Đang giao";
                                  case "4":
                                    return "Hoàn thành";
                                  default:
                                    return "Đơn bị hủy";
                                }
                              })()}
                            </td>
                            <td className="name">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "decimal",
                                decimal: "VND"
                              }).format(value.total) + " VNĐ"}
                            </td>
                            <td className="name">
                              {value.pay === true
                                ? "Đã thanh toán"
                                : "Chưa thanh toán"}
                            </td>
                            <td>
                              <div className="d-flex">
                                <Link
                                  to={"/order/detail/" + value._id}
                                  className="btn btn-info mr-1"
                                >
                                  Chi tiết
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <h4 className="card-title">
                    Tổng tiền:{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "decimal",
                      decimal: "VND"
                    }).format(totalMoney) + " VNĐ"}
                  </h4>
                </div>
                <Pagination
                  filter={filter}
                  onPageChange={onPageChange}
                  totalPage={totalPage}
                />
                <div>
                  <div className="d-flex">
                    <h4>Chọn phương thức thống kê</h4>
                  </div>
                  <br />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={dates.start}
                      dropdownMode="select"
                      onChange={(date) => setDates({ ...dates, start: date })}
                    />
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={dates.end}
                      dropdownMode="select"
                      onChange={(date) => setDates({ ...dates, end: date })}
                    />
                    <input
                      type="submit"
                      className="btn btn-primary"
                      value="Lọc Hóa Đơn"
                      onClick={handlerStatistic}
                    />
                  </div>
                  <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    center
                    classNames={{
                      modal: "customModal"
                    }}
                  >
                    <Chart data={data} options={options} />
                  </Modal>
                </div>
                <div>
                  {errMessage !== "" && (
                    <span className="text-danger">{errMessage}</span>
                  )}
                  {subMessage !== "" && (
                    <span className="text-success">{subMessage}</span>
                  )}
                </div>
                <br />
                <div
                  className="btn btn-primary"
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={handlerTopProduct}
                >
                  Thống kê top 5 sản phẩm bán chạy
                </div>
                <br />
                <a
                  href="#"
                  className="btn btn-success mb-5"
                  onClick={handler_Report}
                  style={{ color: "#fff", cursor: "pointer" }}
                >
                  Thống Kê
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompletedOrder;
