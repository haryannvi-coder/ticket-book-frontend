import React, { useState, useEffect } from 'react';
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";

export default function ThemeButton () {
  const storedTheme = localStorage.getItem('theme');
  const [theme, setTheme] = useState(storedTheme || 'light');

    useEffect(() => {
        // Apply the stored theme or default theme on initial load
        if (storedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        } else {
        document.documentElement.classList.remove('dark');
        }
    }, [theme]);


  return (
    <button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }} className=" text-4xl text-green-500 rounded ">
    {
    theme == 'dark' ? <CiLight /> : <CiDark />

    }
    </button>
  );
};
