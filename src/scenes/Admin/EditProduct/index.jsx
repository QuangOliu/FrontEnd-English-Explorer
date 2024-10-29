import CreateOrEditProduct from "components/CreateOrEditProduct";
import React from "react";
import { useParams } from "react-router-dom";

function EditProduct() {
  const { productId } = useParams();
  return (
    <div>
      <CreateOrEditProduct productId={productId} />
    </div>
  );
}

export default EditProduct;
