import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ElectiveSelection.module.css";

type Props = {};

const ElectiveSelection = (props: Props) => {
  const [userData, setUserData] = useState<any>();
  const [firstStepCompleted, setFirstStepCompleted] = useState(false);
  useEffect(() => {
    axios
      .post("/api/getUserData", {
        token: localStorage.getItem("token"),
      })
      .then((response) => {
        setUserData(response.data.data);
        console.log(response.data.data);
      });
  }, []);
  return (
    <div className="">
      Welcome {userData?.name}({userData?.regNo})
    </div>
  );
};

export default ElectiveSelection;
