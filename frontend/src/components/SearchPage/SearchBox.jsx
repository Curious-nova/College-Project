import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Style = styled.div`
  height: 150px;
  background: linear-gradient(
    to top,
    #030779 0%,
    #03053b 50%,
    #03043d 50%,
    #020420 100%
  );

  .jelo {
    width: 100%;
    background-color: linear-gradient(
      to top,
      #030779 0%,
      #03053b 50%,
      #03043d 50%,
      #020420 100%
    );

    .topdiv {
      position: static;
      width: 90%;
      height: 130px;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;

      .from-to {
        background: rgba(104, 105, 104, 0.3);
        border-radius: 5px;
        height: 30px;
        width: auto;
        padding: 15px;
        margin: 0 20px;
        display: flex;
        align-items: center;

        p {
          height: 12px;
          font-size: 18px;
          font-weight: 600;
          color: #2c98f1;
          margin-right: 10px;
        }

        span {
          color: white;
          font-size: 20px;
        
        }
      }

      .searching {
        color: white;
        font-size: 25px;
        font-weight: bold;
      }
    }
  }

  .hello {
    position: fixed;
    z-index: 100;
    top: 0;
  }
`;

export const SearchBox = ({ handle }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const dataFromLocalStorage = localStorage.getItem("myKey");
    if (dataFromLocalStorage) {
      const { from, to } = JSON.parse(dataFromLocalStorage);
      setFrom(from);
      setTo(to);
    }
  }, []);

  return (
    <Style>
      <div className="jelo">
        <div className="topdiv">
          <div className="searching">Searching for:</div>
          <div className="from-to">
            <p>From:</p>
            <span>{from}</span>
          </div>
          <div className="from-to">
            <p>To:</p>
            <span>{to}</span>
          </div>
        </div>
      </div>
    </Style>
  );
};
