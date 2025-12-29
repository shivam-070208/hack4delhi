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
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add User
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[420px]">
            <h2 className="text-lg font-semibold mb-4">
              Add HR / Employee
            </h2>

            {/* Reusable Form */}
            <UserForm onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
