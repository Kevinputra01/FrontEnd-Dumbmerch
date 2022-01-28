import React, { createElement, useState, useEffect } from "react";

export default function CheckBox(props) {
  const { value, handleChangeCategoryId, categoryId } = props;

  const [isChecked, setIsChecked] = useState();

  const getIsChecked = () => {
    if (categoryId?.length != 0) {
      categoryId?.every((item) => {
        if (item == value) {
          setIsChecked(true);
          return false;
        } else {
          setIsChecked(false);
          return true;
        }
      });
    } else {
      setIsChecked(false);
    }
  };

  useEffect(() => {
    getIsChecked();
  }, [categoryId]);

  return createElement("input", {
    type: "checkbox",
    checked: isChecked,
    value: value,
    onClick: handleChangeCategoryId,
  });
}
