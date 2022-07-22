import React, { useEffect } from "react";

type Props = {};

const ElectiveSelection = (props: Props) => {
  useEffect(() => {
    console.log(localStorage.getItem("token"))
  }, [])
  return <div>ElectiveSelection</div>;
};

export default ElectiveSelection;
