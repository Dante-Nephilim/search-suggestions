import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { URL } from "../constants/constants";
import Button from "@mui/material/Button";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

export default function UserInfo() {
  const [userData, setUserData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const params = useParams();
  useEffect(() => {
    axios
      .get(`${URL}/users/${params.id}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mt-14">
      <Link to="/">
        <Button variant="text" startIcon={<ArrowBackOutlinedIcon />}>
          Back
        </Button>
      </Link>
      {userData && (
        <div className="flex flex-col gap-3 mt-20">
          <h1 className="text-4xl">{userData.name}</h1>
          <h2 className="text-2xl text-gray-700">{userData.username}</h2>
          <h3 className="text-xl">{userData.company.name}</h3>
          <h4 className="text-xl text-blue-700">{userData.email}</h4>
        </div>
      )}
    </div>
  );
}
