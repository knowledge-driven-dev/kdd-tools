---
# @file-pattern: ^PROC-\d{3}-.+\.md$
# @path-pattern: 02-behavior/processes/

id: PROC-NNN                  # @required @pattern: ^PROC-\d{3}$
kind: process                 # @required
status: draft                 # @required @enum: draft|review|approved|deprecated|superseded
---

# PROC-NNN: Process Name <!-- required pattern: ^PROC-\d{3}:\s+.+ -->

## Description <!-- required -->

Brief explanation of what this process achieves and why it runs autonomously.

## Trigger <!-- required -->

This process starts when [[EVT-Something-Happened]] is emitted — for example, when a [[Customer]] completes payment on an [[Order]].

## Steps <!-- required -->

1. The system reserves stock for each line item → [[CMD-Reserve-Stock]]
2. The system generates an invoice → [[CMD-Generate-Invoice]]
3. The system notifies the warehouse → [[CMD-Notify-Warehouse]]
4. The system emits [[EVT-Order-Fulfilled]]

## Compensation <!-- required -->

If **step 1** fails for any item, the system releases already-reserved items via [[CMD-Release-Stock]] and retries after 5 min.

If **step 2** fails, the system releases all reserved stock via [[CMD-Release-Stock]] and marks the [[Order]] as `pending-retry`.

If **step 3** fails, the order is fulfilled but flagged for manual warehouse notification.

## Outcome <!-- required -->

### On Success

- The [[Order]] transitions to `fulfilled`
- All line items have reserved stock
- An invoice exists linked to the order
- The warehouse has a pending shipment

### On Failure

- The [[Order]] transitions to `pending-retry` or `failed` after max retries
- No partial state remains (all steps compensated)
