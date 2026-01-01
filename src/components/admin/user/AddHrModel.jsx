"use client";

import { useState } from "react";
import UserForm from "./HrForm";

export default function AddUserModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        + Add User
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[420px] rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Add HR / Employee</h2>

            {/* Reusable Form */}
            <UserForm onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
