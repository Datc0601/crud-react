import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nombre: '', edad: '', correo: '', telefono: '' });
  const [editingId, setEditingId] = useState(null);


   // Obtener los ítems al cargar el componente
  useEffect(() => {
    axios.get('http://localhost:3001/items')
      .then((response) => setItems(response.data))
      .catch((error) => console.error('Error al obtener los ítems:', error));
  }, []);

   // Manejar los cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };


  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios.put(`http://localhost:3001/items/${editingId}`, form)
        .then(() => {
          setItems(items.map(item => (item.id === editingId ? form : item)));
          setForm({ nombre: '', edad: '', correo: '', telefono: '' });
          setEditingId(null);
        })
        .catch((error) => console.error('Error al actualizar el ítem:', error));
    } else {
       // Crear un nuevo ítem
      axios.post('http://localhost:3001/items', form)
        .then(() => {
          setItems([...items, { ...form, id: items.length + 1 }]); // Nota: La ID debe ser manejada por MySQL.
          setForm({ nombre: '', edad: '', correo: '', telefono: '' });
        })
        .catch((error) => console.error('Error al crear el ítem:', error));
    }
  };

    // Manejar la edición de un ítem
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

   // Manejar la eliminación de un ítem
  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/items/${id}`)
      .then(() => setItems(items.filter(item => item.id !== id)))
      .catch((error) => console.error('Error al eliminar el ítem:', error));
  };

  return (
    <div className='contenedor'>
      <h1>CRUD DE USUARIOS</h1>
      <form className='formulario' onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="number"
          name="edad"
          value={form.edad}
          onChange={handleChange}
          placeholder="Edad"
          required
        />
        <input
          type="email"
          name="correo"
          value={form.correo}
          onChange={handleChange}
          placeholder="Correo"
          required
        />
        <input
          type="tel"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          placeholder="Teléfono"
          required
        />
        <button type="submit">{editingId ? 'Actualizar' : 'Registrar'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Edad</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{item.edad}</td>
              <td>{item.correo}</td>
              <td>{item.telefono}</td>
              <td className='botones'>
                <button className='btnEditar' onClick={() => handleEdit(item)}>Editar</button>
                <button className='btnEliminar' onClick={() => handleDelete(item.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
