import axios from './axiosConfig.ts';
import { PokemonList, PokemonDetails } from '../interfaces/Pokemon.ts';

export async function fetchPokemonList(limit = 10, offset = 0): Promise<PokemonList> {
  const response = await axios.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return response.data.results;
}

export async function fetchPokemonDetails(name: string): Promise<PokemonDetails> {
  const response = await axios.get(`/pokemon/${name}`);
  return response.data;
}