import axios from './axiosConfig.ts';
import { PokemonList, PokemonDetails } from '../interfaces/Pokemon.ts';

export async function fetchPokemonList(limit: number, offset: number): Promise<PokemonList> {
  const response = await axios.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
}

export async function fetchPokemonDetails(name: string): Promise<PokemonDetails> {
  const response = await axios.get(`/pokemon/${name}`);
  return response.data;
}