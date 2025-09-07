import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import Pop2 from "../components/Popup2";
import { useNavigate } from "react-router-dom";

const CheckingToken = ({ redirectTo = "/dashboard", children , path }) => {
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);
  const [showChildren, setShowChildren] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let redirectTimeout;

    const checkToken = async () => {
      try {
        const res = await axios.get({path}, { withCredentials: true });

        if (res.data.authenticated) {
          // Step 1: keep loader for 1s (simulate processing)
          setTimeout(() => {
            setLoading(false);

            // Step 2: show popup after loader finishes
            setPopup({
              message: "✅ Signed up successfully! Redirecting to dashboard...",
              type: "success",
            });

            // Step 3: redirect after 1.5s
            redirectTimeout = setTimeout(() => navigate(redirectTo), 1500);
          }, 1000);
        } else {
          // Not authenticated → show page
          setShowChildren(true);
          setLoading(false);
        }
      } catch {
        setShowChildren(true); // error → show page
        setLoading(false);
      }
    };

    checkToken();

    return () => {
      if (redirectTimeout) clearTimeout(redirectTimeout);
    };
  }, [navigate, redirectTo]);

  return (
    <>
      {/* Show loader during auth check */}
      {loading && <Loading />}

      {/* Popup appears after loader if authenticated */}
      {popup && (
        <Pop2
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}

      {/* Show page if unauthenticated */}
      {!loading && showChildren && children}
    </>
  );
};

export default CheckingToken;
