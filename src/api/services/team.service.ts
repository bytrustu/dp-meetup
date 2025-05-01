import { supabase } from '../supabase';
import { Team, TeamCreate } from '../../types/team.types';

export const teamService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*');
    
    if (error) {
      console.error('팀 목록 조회 오류:', error);
      return null;
    }
    
    return data as Team[];
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`'${id}' 팀 ID 조회 오류:`, error);
      return null;
    }
    
    return data as Team;
  },
  
  getByBatch: async (batch: number) => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('batch', batch)
      .eq('is_active', true);
    
    if (error) {
      console.error(`${batch}기 팀 목록 조회 오류:`, error);
      return null;
    }
    
    return data as Team[];
  },
  
  getAllByBatch: async (batch: number) => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('batch', batch);
    
    if (error) {
      console.error(`${batch}기 전체 팀 목록 조회 오류:`, error);
      return null;
    }
    
    return data as Team[];
  },
  
  getByName: async (name: string) => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('name', name)
      .single();
    
    if (error) {
      console.error(`'${name}' 팀 조회 오류:`, error);
      return null;
    }
    
    return data as Team;
  },
  
  create: async (team: TeamCreate) => {
    const { data, error } = await supabase
      .from('teams')
      .insert([team])
      .select();
    
    if (error) {
      console.error('팀 추가 오류:', error);
      return null;
    }
    
    return data as Team[];
  },
  
  update: async (id: string, team: Partial<TeamCreate>) => {
    const { data, error } = await supabase
      .from('teams')
      .update(team)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('팀 수정 오류:', error);
      return null;
    }
    
    return data as Team[];
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('팀 삭제 오류:', error);
      return false;
    }
    
    return true;
  }
}; 