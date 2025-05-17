import { supabase } from '../../../shared/api/supabase';
import { Participant, ParticipantCreate } from '../types';

export const participantService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('participants')
      .select('*');
    
    if (error) {
      console.error('참가자 목록 조회 오류:', error);
      return null;
    }
    
    return data as Participant[];
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`'${id}' 참가자 ID 조회 오류:`, error);
      return null;
    }
    
    return data as Participant;
  },
  
  getByBatch: async (batch: number) => {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('batch', batch);
    
    if (error) {
      console.error(`${batch}기 참가자 목록 조회 오류:`, error);
      return null;
    }
    
    return data as Participant[];
  },
  
  getTeamCounts: async (batch: number) => {
    const { data, error } = await supabase
      .from('participants')
      .select('team')
      .eq('batch', batch);
    
    if (error) {
      console.error(`${batch}기 팀별 참가자 수 조회 오류:`, error);
      return null;
    }
    
    const teamCounts: Record<string, number> = {};
    data.forEach((participant: { team?: string }) => {
      if (participant.team) {
        teamCounts[participant.team] = (teamCounts[participant.team] || 0) + 1;
      }
    });
    
    return teamCounts;
  },
  
  getByName: async (name: string) => {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('name', name);
    
    if (error) {
      console.error(`'${name}' 참가자 조회 오류:`, error);
      return null;
    }
    
    return data as Participant[];
  },
  
  create: async (participant: ParticipantCreate) => {
    const { data, error } = await supabase
      .from('participants')
      .insert([participant])
      .select();
    
    if (error) {
      console.error('참가자 추가 오류:', error);
      return null;
    }
    
    return data as Participant[];
  },
  
  update: async (id: string, participant: Partial<ParticipantCreate>) => {
    const { data, error } = await supabase
      .from('participants')
      .update(participant)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('참가자 수정 오류:', error);
      return null;
    }
    
    return data as Participant[];
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('참가자 삭제 오류:', error);
      return false;
    }
    
    return true;
  }
}; 