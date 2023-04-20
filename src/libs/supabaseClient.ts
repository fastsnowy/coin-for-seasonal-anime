/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createClient } from '@supabase/supabase-js'

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/configs'

export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
