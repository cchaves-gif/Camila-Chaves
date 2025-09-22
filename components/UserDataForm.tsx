
import React, { useState } from 'react';
import type { UserData } from '../types';

interface UserDataFormProps {
  onFormSubmit: (data: UserData) => void;
  onPlayAgain: () => void;
}

const UserDataForm: React.FC<UserDataFormProps> = ({ onFormSubmit, onPlayAgain }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && university) {
      onFormSubmit({ name, email, university });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-2xl">
        <h3 className="text-2xl font-bold text-green-400 mb-4">¡Gracias por participar!</h3>
        <p className="mb-6">Tus datos han sido guardados.</p>
        <button
          onClick={onPlayAgain}
          className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
        >
          Jugar de Nuevo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-8 bg-gray-800 rounded-lg shadow-2xl w-full max-w-md">
      <h3 className="text-2xl font-bold text-center mb-4">Registra tus Datos</h3>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nombre Completo</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
        />
      </div>
      <div>
        <label htmlFor="university" className="block text-sm font-medium text-gray-300">Universidad</label>
        <input
          type="text"
          id="university"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          required
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-red-500 focus:border-red-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
      >
        Guardar y Finalizar
      </button>
    </form>
  );
};

export default UserDataForm;
