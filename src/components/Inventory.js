import { useEffect, useState } from "react";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [updateData, setUpdateData] = useState({ drugName: "", quantity: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("http://localhost:5000/inventory");
        const data = await response.json();
        console.log("Fetched Inventory Data:", data); // ✅ Debugging
        setInventory(data.inventory || []);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setError("Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []); // ✅ Runs only once on component mount

  const handleUpdate = async () => {
    if (!updateData.drugName || !updateData.quantity) {
      setError("Please enter both drug name and quantity!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/update_stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drug_name: updateData.drugName,
          drug_quantity: parseInt(updateData.quantity),
        }),
      });

      const result = await response.json();
      console.log("Update Response:", result); // ✅ Debugging

      alert(result.message);

      setInventory((prevInventory) =>
        prevInventory.map((drug) =>
          drug.drug_name === result.updated_inventory.drug_name
            ? result.updated_inventory
            : drug
        )
      );
    } catch (error) {
      console.error("Error updating inventory:", error);
      setError("Stock update failed. Try again.");
    }
  };

  return (
    <section>
      <div className="inventoryout">
        <div className="inventory">
          <h2>Drug Inventory</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Drug Name</th>
                <th>Stock Level</th>
                <th>Reorder Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map((drug, index) => (
                  <tr key={index}>
                    <td>{drug.drug_name}</td>
                    <td>{drug.drug_quantity}</td>
                    <td>{drug.reorder_level}</td>
                    <td>{drug.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No drugs available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="updatestock">
        <h3>Update Stock</h3>
        <input
          type="text"
          placeholder="Drug Name"
          onChange={(e) =>
            setUpdateData({ ...updateData, drugName: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Quantity"
          onChange={(e) =>
            setUpdateData({ ...updateData, quantity: e.target.value })
          }
        />
        <button onClick={handleUpdate}>Update Inventory</button>
      </div>
    </section>
  );
};

export default Inventory;
