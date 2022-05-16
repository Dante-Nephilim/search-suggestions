import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { URL } from "../constants/constants";

export default function UserInfo() {
  const [userData, setUserData] = useState();
  const params = useParams();
  useEffect(() => {
    axios
      .get(`${URL}/users/${params.id}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        setUserData(err);
      });
  }, []);

  return (
    <>
      <Link to="/">Back</Link>
      {userData && (
        <div>
          <h1>{userData.name}</h1>
          <h2>{userData.username}</h2>
          <h3>{userData.company.name}</h3>
          <h4>{userData.email}</h4>
        </div>
      )}
    </>
  );
}
