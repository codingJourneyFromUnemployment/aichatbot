'use client';

import React, { useState } from "react";
import Card from "./dialogcard";
import DialogForm from "./inputform";
import DialogTitle from "./dialogtitle";

interface DialogTitleProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}



export default function ChatBox() {
  const [title, setTitle] = useState("Dialog Title");

  return (
    <div className="z-10 flex flex-col justify-between items-center grow">
      <DialogTitle title={title} />
      <Card />
      <DialogForm setTitle={setTitle} />
    </div>
  );
}
