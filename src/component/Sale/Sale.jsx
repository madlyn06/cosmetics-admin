import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";

import permissionAPI from "../Api/permissionAPI";
import Pagination from "../Shared/Pagination";
import Search from "../Shared/Search";
import SaleAPI from "../Api/SaleAPI";

function Sale(props) {
  const [filter, setFilter] = useState({
    page: "1",
    limit: "4",
    search: "",
    status: true
  });

  const [sale, setSale] = useState([]);
  const [totalPage, setTotalPage] = useState();

  useEffect(() => {
    const query = "?" + queryString.stringify(filter);

    const fetchAllData = async () => {
      const ct = await SaleAPI.getAll(query);
      setTotalPage(ct.totalPage);
      setSale(ct.sale);
    };

    fetchAllData();
  }, [filter]);

  const onPageChange = (value) => {
    setFilter({
      ...filter,
      page: value
    });
  };

  const handlerSearch = (value) => {
    setFilter({
      ...filter,
      page: "1",
      search: value
    });
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Các sản phẩm giảm giá</h4>
                <Search handlerSearch={handlerSearch} />

                <Link to="/sale/create" className="btn btn-primary my-3">
                  Thêm sản phẩm giảm giá
                </Link>

                <div className="table-responsive">
                  <table className="table table-striped table-bordered no-wrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Khuyến mãi</th>
                        <th>Mô tả</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>

                    <tbody>
                      {sale &&
                        sale.map((value, index) => (
                          <tr key={index}>
                            <td className="name">{value._id}</td>
                            <td className="name">{value.promotion}</td>
                            <td className="name">{value.describe}</td>
                            <td className="name">{value.start}</td>
                            <td className="name">{value.end}</td>
                            <td className="name">
                              {value.status ? "Active" : "Disable"}
                            </td>
                            <td>
                              <div className="d-flex">
                                <Link
                                  to={"/sale/" + value._id}
                                  className="btn btn-success mr-1"
                                >
                                  Cập nhật
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <Pagination
                    filter={filter}
                    onPageChange={onPageChange}
                    totalPage={totalPage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sale;
