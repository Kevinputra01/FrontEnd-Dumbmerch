import React from "react";
import { Link } from "react-router-dom";

import convertRupiah from "rupiah-format";

export default function ProductCard({ item, index }) {
  return (
    <Link
      to={`/product/` + item.id}
      style={{ textDecoration: "none" }}
      key={index}
    >
      <div className="card-product mt-3">
        <img src={item.image} className="img-fluid img-rounded" />
        <div className="p-2">
          <div className="text-header-product-item">{item.name}</div>
          <div className="text-product-item">
            {convertRupiah.convert(item.price)}
          </div>
          <div className="text-product-item">Stock : {item.qty}</div>
        </div>
      </div>
    </Link>
  );
}
