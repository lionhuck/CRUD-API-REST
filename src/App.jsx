import { useState, Fragment, useRef, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import './App.css';

function App() {
  const [listItems, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [inputProduct, setInputProduct] = useState('');
  const [inputYear, setInputYear] = useState('');
  const [inputPrice, setInputPrice] = useState('');
  const [inputCpu, setInputCpu] = useState('');
  const [inputDisk, setInputDisk] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  

  const postApi = async (addItem) => {
    const response = await fetch ('https://api.restful-api.dev/objects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addItem)
    })
    console.log(response);
    
    if(response.status === 200){
      const data = await response.json() 
      console.log(data)     
      setItems([...listItems, data])
      console.log(listItems)
      setLoadingItems(false)
    }
  }

  const addItem = () => {
    setLoadingItems(true)
    const newItem = (
        { "name": inputProduct, 
          "data": {
            "year": inputYear, 
            "price": inputPrice, 
            "CPU model": inputCpu,
            "Hard disk size": inputDisk }
      });
      postApi(newItem)
  };


  const updateItem = async (id, updatedData) => {
    try {
      const response = await fetch(`https://api.restful-api.dev/objects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      const data = await response.json();
      console.log('Objeto actualizado:', data);
      
      // Actualiza el estado con el item modificado
      setItems(listItems.map(item => item.id === id ? data : item));
      setEditingItem(null);
      setLoadingItems(false);
      
      return data;
    } catch (error) {
      console.error('Error al actualizar:', error);
      setLoadingItems(false);
      throw error;
    }
  };
  
  const editItem = (item) => {
    // Prepara los datos para edición
    setEditingItem({
      id: item.id,
      name: item.name,
      year: item.data.year,
      price: item.data.price,
      cpu: item.data["CPU model"],
      disk: item.data["Hard disk size"]
    });
  };
  
  const saveEdit = async () => {
      setLoadingItems(true);
      const updatedItem = {
        name: editingItem.name,
        data: {
          year: editingItem.year,
          price: editingItem.price,
          "CPU model": editingItem.cpu,
          "Hard disk size": editingItem.disk
        }
      };
      
      await updateItem(editingItem.id, updatedItem);
    };



  const removeItem = (id) => {
    setItems(listItems.filter(item => item.id !== id));
  };










  const removeAllItems = () => {
    setItems([]);
  };




  const bodyActions = (rowData) => {
    return (
      <Fragment>
        <button onClick={() => removeItem(rowData.id)}>Eliminar</button>
        <button onClick={() => editItem(rowData)}>Editar</button>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <div>
        <input 
          type="text" 
          value={inputProduct} 
          onChange={(e) => setInputProduct(e.target.value)} 
          placeholder="Nombre del producto"
        />
        <input 
        type="number" 
        value={inputYear} 
        onChange={(e) => setInputYear(e.target.value)} 
        placeholder="Año" />
        <input 
        type="number" 
        value={inputPrice} 
        onChange={(e) => setInputPrice(e.target.value)} 
        placeholder="Precio" />
        <input 
        type="text" 
        value={inputCpu} 
        onChange={(e) => setInputCpu(e.target.value)} 
        placeholder="CPU Model" />
        <input 
        type="text" 
        value={inputDisk} 
        onChange={(e) => setInputDisk(e.target.value)} 
        placeholder="Hard disk Size" />
        <button onClick={addItem}>Agregar</button>
        <button onClick={removeAllItems}>Eliminar todos</button>
      </div>

      {editingItem && (
        <div>
          <h3>Editando producto</h3>
          <input 
            value={editingItem.name} 
            onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
          />
          <input 
            type="number" 
            value={editingItem.year} 
            onChange={(e) => setEditingItem({...editingItem, year: Number(e.target.value)})}
          />
          <input 
            type="number" 
            value={editingItem.price} 
            onChange={(e) => setEditingItem({...editingItem, price: Number(e.target.value)})}
          />
          <input 
            type="text" 
            value={editingItem.cpu} 
            onChange={(e) => setEditingItem({...editingItem, cpu: e.target.value})}
          />
          <input 
            type="text" 
            value={editingItem.disk} 
            onChange={(e) => setEditingItem({...editingItem, disk: e.target.value})}
          />
          <button onClick={saveEdit}>Guardar</button>
          <button onClick={() => setEditingItem(null)}>Cancelar</button>
        </div>
      )}
      {loadingItems ? (
        <i>Cargando...</i>
      ) : listItems.length > 0 ? (
        <DataTable value={listItems} paginator rows={10} tableStyle={{ minWidth: '50rem' }}>
          <Column field="id" header="Id"></Column>
          <Column field="name" header="Nombre"></Column>
          <Column field="data.year" header="Año"></Column>
          <Column field="data.price" header="Precio"></Column>
          <Column field="data.CPU model" header="Cpu"></Column>
          <Column field="data.Hard disk size" header="Disk"></Column>
          <Column body={bodyActions} header="Acciones"></Column>
        </DataTable>
      ) : (
        <p>No hay datos disponibles.</p>
      )}
    </Fragment>
  );
}

export default App;