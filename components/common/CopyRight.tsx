"use client";

const CopyRight = () => {
  const year = new Date().getFullYear();

  return (
    <p>
      © {year} E-Learning and Earning Ltd. All Rights Reserved
    </p>
  );
};

export default CopyRight;