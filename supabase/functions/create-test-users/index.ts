import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const testUsers = [
      { email: 'admin@estoqx.com', password: 'Teste123!', nome: 'Administrador', role: 'admin' },
      { email: 'gestor@estoqx.com', password: 'Teste123!', nome: 'Gestor Silva', role: 'gestor' },
      { email: 'almoxarife@estoqx.com', password: 'Teste123!', nome: 'Almoxarife Santos', role: 'almoxarife' },
      { email: 'encarregado@estoqx.com', password: 'Teste123!', nome: 'Encarregado Oliveira', role: 'encarregado' },
      { email: 'operador@estoqx.com', password: 'Teste123!', nome: 'Operador Costa', role: 'operador' },
    ]

    const results = []

    for (const user of testUsers) {
      // Create user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { nome: user.nome }
      })

      if (authError) {
        results.push({ email: user.email, status: 'error', message: authError.message })
        continue
      }

      // Update role (the trigger creates 'operador' by default, so we need to update if different)
      if (user.role !== 'operador' && authData.user) {
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .update({ role: user.role })
          .eq('user_id', authData.user.id)

        if (roleError) {
          results.push({ email: user.email, status: 'user_created', roleError: roleError.message })
          continue
        }
      }

      results.push({ email: user.email, status: 'success', role: user.role })
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
