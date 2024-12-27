import React, { useState } from "react";
import { useForm } from "react-hook-form";
import queryString from "query-string";
import isEmpty from "validator/lib/isEmpty";
import categoryApi from "../Api/categoryAPI";

function CreateCategory(props) {
  const [name, setName] = useState("");
  const [category] = useState(["Dưỡng da", "Trang điểm mắt môi", "Làm sạch"]);
  const [categoryChoose, setCategoryChoose] = useState("");
  const [validationMsg, setValidationMsg] = useState("");
  const { handleSubmit } = useForm();

  const validateAll = () => {
    let msg = {};
    if (isEmpty(name)) {
      msg.name = "Tên không được để trống";
    }
    if (!categoryChoose) {
      msg.category = "Loại sản phẩm không được để trống";
    }
    setValidationMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const handleCreate = () => {
    const isValid = validateAll();
    if (!isValid) return;
    addCategory();
  };

  const addCategory = async () => {
    const query =
      "?" + queryString.stringify({ name: name, gender: categoryChoose });
    const response = await categoryApi.create(query);
    if (response.msg === "Bạn đã thêm thành công") {
      setName("");
    }
    setValidationMsg({ api: response.msg });
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Thêm danh mục</h4>
                {/* <h4 className="card-title">Create Producer</h4> */}
                {validationMsg.api === "Bạn đã thêm thành công" ? (
                  <div
                    className="alert alert-success alert-dismissible fade show"
                    role="alert"
                  >
                    {validationMsg.api}
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                ) : (
                  <p className="form-text text-danger">{validationMsg.api}</p>
                )}

                <form onSubmit={handleSubmit(handleCreate)}>
                  <div className="form-group w-50">
                    <label htmlFor="name">Tên loại</label>
                    {/* <label htmlFor="name">Tên nhà sản xuất: </label> */}
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <p className="form-text text-danger">
                      {validationMsg.name}
                    </p>
                  </div>

                  <div className="form-group w-50">
                    {/* <label htmlFor="categories" className="mr-2">Chọn loại:</label> */}
                    <label htmlFor="categories" className="mr-2">
                      Chọn loại sản phẩm:
                    </label>
                    <select
                      name="categories"
                      id="categories"
                      value={categoryChoose}
                      onChange={(e) => setCategoryChoose(e.target.value)}
                    >
                      <option>Chọn loại</option>
                      {category &&
                        category.map((item, index) => (
                          <option value={index + 1} key={index}>
                            {item}
                          </option>
                        ))}
                    </select>
                    <p className="form-text text-danger">
                      {validationMsg.category}
                    </p>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Thêm
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCategory;
