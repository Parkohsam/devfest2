# Security Specification & Threat Model

## Data Invariants
1. **User Identity Isolation**: A user can only access, create, read, update, or delete records under `/users/{userId}` and `/users/{userId}/tasks/{taskId}` where `userId == request.auth.uid`. Cross-user access is mathematically blocked.
2. **Path & ID Integrity**: All document IDs must satisfy `isValidId(id)` (`^[a-zA-Z0-9_\-]+$`, max 128 chars).
3. **Immutability of Key Attributes**: `createdAt`, `userId`, and `id` cannot be modified during updates.
4. **Temporal Verification**: On task creation and update, timestamps must follow valid timestamp validation.
5. **No Blanket Access**: There are no unauthenticated reads or global queries across all users' tasks. List queries are strictly scoped to the authenticated user's subcollection.
6. **Strict Schema Integrity**: Payload keys must match expected required and optional fields without phantom/ghost properties.

## The "Dirty Dozen" Attack Payloads (All MUST return PERMISSION_DENIED)

1. **Unauthenticated Read Attack**: An unauthenticated request attempts to list `/users/user_123/tasks`.
2. **Cross-Tenant Read Attack**: Authenticated user `attacker_456` attempts to read `/users/victim_789/tasks/task_001`.
3. **Cross-Tenant List Attack**: Authenticated user `attacker_456` attempts to list `/users/victim_789/tasks`.
4. **Cross-Tenant Create Attack**: Authenticated user `attacker_456` attempts to create a task in `/users/victim_789/tasks/task_malicious`.
5. **Identity Spoofing in Payload**: User `attacker_456` writes to `/users/attacker_456/tasks/task_001` with `userId: "victim_789"`.
6. **Ghost/Shadow Field Injection**: User attempts to create a task with an injected administrative field `isAdmin: true` or `shadowField: "exploit"`.
7. **Document ID Path Traversal / Poisoning**: Attempting to write with a 2KB garbage character string or path injection characters as document ID.
8. **Immutability Breach on Update**: User attempts to update a task and change `createdAt` or change `userId` to another user.
9. **Volumetric Denial-of-Wallet Attack**: Attempting to insert a 500,000 character string into `title` or `description`.
10. **State Corruption via Invalid Enum**: Attempting to set `priority` to `"super-urgent-bypass"` or `category` to a non-whitelisted string.
11. **Type Confusion Attack**: Attempting to set `completed` to a string `"yes"` or an object `{ completed: true }` instead of boolean.
12. **Cross-Tenant Delete Attack**: User `attacker_456` attempts to delete `/users/victim_789/tasks/task_001`.

## Test Runner Architecture
All 12 attacks are validated against Firestore Rules to guarantee strict denial.
