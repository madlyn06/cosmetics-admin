import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import categoryAPI from "../Api/categoryAPI";
import isEmpty from "validator/lib/isEmpty";
import productAPI from "../Api/productAPI";
import axiosClient from "../Api/axiosClient";
import { useHistory } from "react-router-dom";

function UpdateProduct(props) {
  const [id] = useState(props.match.params.id);
  const [category, setCategory] = useState([]);
  const [gender] = useState([
    {
      label: "Dưỡng da",
      value: "1"
    },
    {
      label: "Trang điểm mắt môi",
      value: "2"
    },
    {
      label: "Làm sạch",
      value: "3"
    }
  ]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [number, setNumber] = useState("");
  const [categoryChoose, setCategoryChoose] = useState("");
  const [genderChoose, setGenderChoose] = useState("1");
  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [fileName, setFileName] = useState("");
  const [validationMsg, setValidationMsg] = useState("");
  const { handleSubmit } = useForm();
  let history = useHistory();
  useEffect(() => {
    const fetchAllData = async () => {
      const ct = await categoryAPI.getAPI();
      const rs = await productAPI.details(id);
      setName(rs.name_product);
      setPrice(rs.price_product);
      setDescription(rs.describe);
      // setNumber(rs.number)
      setCategoryChoose(rs.id_category);
      setImage(rs.image);
      setCategory(ct);
    };
    fetchAllData();
  }, []);

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onChangeNumber = (e) => {
    const value = e.target.value;
    if (!Number.isNaN(value) && Number(value) >= 0) {
      setNumber(value);
    }
  };

  const onChangePrice = (e) => {
    const value = e.target.value;
    if (!Number.isNaN(value) && Number(value) > 0) {
      setPrice(value);
    }
  };

  const validateAll = () => {
    let msg = {};
    if (isEmpty(name)) {
      msg.name = "Tên không được để trống";
    }
    if (isEmpty(price)) {
      msg.price = "Giá không được để trống";
    }
    if (isEmpty(description)) {
      msg.description = "Mô tả không được để trống";
    }
    if (isEmpty(number.toString())) {
      msg.number = "Số lượng không được để trống";
    }
    if (isEmpty(categoryChoose)) {
      msg.category = "Vui lòng chọn loại";
    }

    setValidationMsg(msg);
    if (Object.keys(msg).length > 0) return false;
    return true;
  };

  const handleCreate = () => {
    const isValid = validateAll();
    if (!isValid) return;
    addProduct();
  };

  const addProduct = async () => {
    let result;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      result = await axiosClient.post("uploads/cloudinary-upload", formData);
      setImage(result?.secure_url);
    }

    const data = {
      id,
      name,
      price,
      number,
      category: categoryChoose,
      description,
      gender: genderChoose,
      file: result?.secure_url || image
    };

    const response = await productAPI.update(data);

    if (response.msg === "Bạn đã update thành công") {
      window.scrollTo(0, 0);
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
                <h4 className="card-title">Cập nhật sản phẩm</h4>
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
                    <label htmlFor="name">Tên Sản Phẩm</label>
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
                    <label htmlFor="price">Giá Sản Phẩm</label>
                    <input
                      type="text"
                      className="form-control"
                      id="price"
                      name="price"
                      value={price}
                      onChange={(e) => onChangePrice(e)}
                      required
                    />
                    <p className="form-text text-danger">
                      {validationMsg.price}
                    </p>
                  </div>
                  <div className="form-group w-50">
                    <label htmlFor="description">Mô tả</label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    <p className="form-text text-danger">
                      {validationMsg.description}
                    </p>
                  </div>
                  <div className="form-group w-50">
                    <label htmlFor="number">Số lượng: </label>
                    <input
                      type="text"
                      className="form-control"
                      id="number"
                      name="number"
                      value={number}
                      onChange={(e) => onChangeNumber(e)}
                      required
                    />
                    <p className="form-text text-danger">
                      {validationMsg.number}
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
                          <option value={item._id} key={index}>
                            {item.category}
                          </option>
                        ))}
                    </select>
                    <p className="form-text text-danger">
                      {validationMsg.category}
                    </p>
                  </div>

                  <div className="form-group w-50">
                    <label htmlFor="gender" className="mr-2">
                      Chọn dòng sản phẩm
                    </label>
                    <select
                      name="gender"
                      id="gender"
                      value={genderChoose}
                      onChange={(e) => setGenderChoose(e.target.value)}
                    >
                      {gender &&
                        gender.map((item, index) => (
                          <option value={item.value} key={index}>
                            {item.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group w-50">
                    <label>Hình Ảnh</label>
                    <input
                      type="file"
                      className="form-control-file"
                      name="file"
                      onChange={saveFile}
                    />
                  </div>

                  <div className="form-group w-50">
                    <label>Hình Ảnh</label>
                    <img src={image} alt="" style={{ width: "70px" }} />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Cập nhật sản phẩm
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

export default UpdateProduct;
