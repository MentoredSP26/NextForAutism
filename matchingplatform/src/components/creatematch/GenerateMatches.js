import { getAvailableEstablished, getAspiringProfessionalByID } from '../../api/queries';

async function generateMatches(menteeId) {
  try {
    const aspiring = await getAspiringProfessionalByID(menteeId);
    if (!aspiring) throw new Error("Aspiring not found.");

    const availableMentors = await getAvailableEstablished();
    if (availableMentors.length === 0) {
      return { success: false, message: "No established professionals currently have capacity." };
    }

    let bestMentor = null;
    let highestScore = -1;
    let fields = [];

    for (const mentor of availableMentors) {
      let score = 0;

      if (mentor.field === aspiring.field) {
        score += 70;
        fields += "field";
      }

      if (mentor.university === aspiring.university) {
        score += 30;
        fields += "university";
      }

      if (score > highestScore) {
        highestScore = score;
        bestMentor = mentor;
      } else if (score === highestScore && bestMentor) {
        if (mentor.capacity > bestMentor.capacity) {
          bestMentor = mentor;
        }
      }
    }

    if (!bestMentor || highestScore === 0) {
      return { success: false, message: "no suggested matches" };
    }

    const { data, error } = await supabase
      .from('matches')
      .insert([
        { 
          aspiring_id: aspiring.id, 
          established_id: bestMentor.id, 
          compatibility_score: highestScore,
          compatability_attributes: fields,
          status: 'suggested',
          created_at: new Date()
        }
      ]);
      if (error) throw error;

    return {
      success: true,
      message: "Successful generated match!",
      mentor: bestMentor,
      score: highestScore
    };

  } catch (error) {
    console.error("Error matching mentor:", error);
    return { success: false, error: error.message };
  }
}