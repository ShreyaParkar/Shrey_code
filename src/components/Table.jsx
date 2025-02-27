const Table = ({ title, data, columns, onEdit, onDelete }) => {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead className="bg-gray-800 text-white">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="py-3 px-6 text-left">{col}</th>
                ))}
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="border-b">
                    {columns.map((col) => (
                      <td key={col} className="py-2 px-6">{item[col]}</td>
                    ))}
                    <td className="py-2 px-6">
                      <button onClick={() => onEdit(item)} className="text-blue-600 mr-2">Edit</button>
                      <button onClick={() => onDelete(item._id)} className="text-red-600">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Table;
  