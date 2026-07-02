-- ============================================================================
-- Booking action type — a deal whose action_type = 'booking' is bookable
-- through OutQuest: a 2-step sheet collects the visitor's details (Step 1)
-- then takes a deposit or full payment (Step 2). These columns store the
-- admin-configured payment terms + the program-specific Step 1 form fields.
-- ============================================================================

-- 'deposit' (charge a deposit now, balance later) | 'full' (charge full upfront)
alter table deals add column if not exists pay_type text;
-- Full program price (Step 2 breakdown / deposit box).
alter table deals add column if not exists total_price numeric;
-- Amount charged now when pay_type = 'deposit'.
alter table deals add column if not exists deposit_amount numeric;
-- Refund / cancellation policy line, shown beneath the payment amount.
alter table deals add column if not exists refund_policy text;
-- Program-specific Step 1 questions (label/type/options/placeholder/required).
alter table deals add column if not exists booking_fields jsonb not null default '[]';
