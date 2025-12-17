import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type AppRole = "admin" | "gestor" | "almoxarife" | "encarregado" | "operador";

export function useUserRole() {
  const { user } = useAuth();

  const { data: role, isLoading } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }

      return data?.role as AppRole | null;
    },
    enabled: !!user?.id,
  });

  const isAdmin = role === "admin";
  const isGestor = role === "gestor";
  const isAlmoxarife = role === "almoxarife";

  return {
    role,
    isLoading,
    isAdmin,
    isGestor,
    isAlmoxarife,
  };
}
