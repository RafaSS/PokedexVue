import axios from './axiosConfig.ts'
import {
  PokemonList,
  PokemonDetails,
  EvolutionChain,
  PokemonSpecies,
  PokemonType,
} from '../interfaces/Pokemon.ts'

export async function fetchPokemonList(
  limit: number,
  offset: number
): Promise<PokemonList> {
  const response = await axios.get(
    `/pokemon-species?limit=${limit}&offset=${offset}`
  )
  return response.data
}

export async function fetchPokemonDetails(
  name: string
): Promise<PokemonDetails> {
  const response = await axios.get(`/pokemon/${name}`)
  return response.data
}

export async function fetchPokemonEvolutionChain(
  id: number
): Promise<EvolutionChain> {
  const response = await axios.get(`/evolution-chain/${id}`)
  return response.data
}

export async function fetchTypeDetails(name: string): Promise<PokemonType> {
  const response = await axios.get(`/type/${name}`)
  return response.data
}

export async function fetchPokemonSpecies(
  name: string
): Promise<PokemonSpecies> {
  const response = await axios.get(`/pokemon-species/${name}`)
  return response.data
}
