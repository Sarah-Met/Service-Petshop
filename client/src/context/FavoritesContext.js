import React, { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  // Separate state for pets and products
  const [favoritePetIds, setFavoritePetIds] = useState(() => {
    const stored = localStorage.getItem('favoritePetIds');
    return stored ? JSON.parse(stored) : [];
  });
  const [favoriteProductIds, setFavoriteProductIds] = useState(() => {
    const stored = localStorage.getItem('favoriteProductIds');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoritePetIds', JSON.stringify(favoritePetIds));
  }, [favoritePetIds]);

  useEffect(() => {
    localStorage.setItem('favoriteProductIds', JSON.stringify(favoriteProductIds));
  }, [favoriteProductIds]);

  // Pet favorites
  const addFavoritePet = (id) => setFavoritePetIds((ids) => [...new Set([...ids, id])]);
  const removeFavoritePet = (id) => setFavoritePetIds((ids) => ids.filter((favId) => favId !== id));
  const isFavoritePet = (id) => favoritePetIds.includes(id);

  // Product favorites
  const addFavoriteProduct = (id) => setFavoriteProductIds((ids) => [...new Set([...ids, id])]);
  const removeFavoriteProduct = (id) => setFavoriteProductIds((ids) => ids.filter((favId) => favId !== id));
  const isFavoriteProduct = (id) => favoriteProductIds.includes(id);

  return (
    <FavoritesContext.Provider value={{
      favoritePetIds, favoriteProductIds,
      addFavoritePet, removeFavoritePet, isFavoritePet,
      addFavoriteProduct, removeFavoriteProduct, isFavoriteProduct
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}; 
