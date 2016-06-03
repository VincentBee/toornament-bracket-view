/**
 * @param opponent
 *
 * @returns String
 */
function getParticipantName(opponent)
{
    if (opponent.participant !== null) {
        if (opponent.participant.name != null) {
            return opponent.participant.name;
        }
        return 'Participant #'+ opponent.participant.number;
    }

    return '-';
}

/**
 * @param opponent
 *
 * @returns String
 */
function getOpponentResult(opponent)
{
    switch (opponent.result) {
        case 1:
            return 'win';
        case 2:
            return 'draw';
        case 3:
            return 'loss';
    }
}

/**
 * @param opponent
 *
 * @returns String
 */
function getOpponentScore(opponent)
{
    if (opponent.score !== null) {
        return opponent.score;
    }

    switch (opponent.result) {
        case 1:
            return 'W';
        case 2:
            return 'D';
        case 3:
            return 'L';
    }
}
