# Database Models Documentation

## User

Stores registered users of the GFF League Manager system.

- **admin**: GFF officials with full CRUD access
- **user**: Fans and supporters with read-only access

Passwords are hashed with bcrypt before storage. The `password` field is excluded from query results by default (`select: false`).

## Team (Club)

Represents a football club in the Gambia Football Federation domestic league.

- Unique constraint on `name` + `season` combination
- `city` is restricted to recognised Gambian locations
- Virtual field `goalDifference` = goalsFor - goalsAgainst

## Player

Represents a registered player linked to a club.

- **Relationship**: Many players belong to one team (`team` field references Team)
- Unique constraint on `team` + `jerseyNumber` (no duplicate numbers within a club)
- Default nationality is `Gambian`

## Entity Relationship

```
User (1) ──creates──► (N) Team
User (1) ──creates──► (N) Player
Team (1) ◄──belongs── (N) Player
```
