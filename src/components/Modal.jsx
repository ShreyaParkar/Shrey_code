import { useState } from "react";

const Modal = ({ data, type, onClose, onSave }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await fetch(`/api/${type}/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Edit {type}</h2>
        {Object.keys(data).map((key) => (
          key !== "_id" && (
            <input key={key} name={key} value={formData[key]} onChange={handleChange} className="w-full mb-2 p-2 border rounded" />
          )
        ))}
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white p-2 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
