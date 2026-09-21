import { useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AppPage, PageHeader } from "@/components/ui/app-shell";

const PersonalityQuiz = () => {
  const navigate = useNavigate();

  const personalityTraits = [
    "I enjoy talking to people.",
    "I often notice flaws in others.",
    "I make sure to do tasks carefully.",
    "I often feel down or blue.",
    "I enjoy coming up with new ideas.",
    "I prefer keeping to myself.",
    "I like helping people when I can.",
    "I can be careless sometimes.",
    "I handle stress well and stay calm.",
    "I’m curious about many things.",
    "I usually have a lot of energy.",
    "I get into arguments with others.",
    "I can be counted on to do a good job.",
    "I feel tense or nervous often.",
    "I enjoy thinking deeply about things.",
    "I’m enthusiastic and excited about things.",
    "I tend to forgive people easily.",
    "I can be a bit disorganized.",
    "I worry a lot about different things.",
    "I often use my imagination.",
    "I tend to be quiet in social settings.",
    "I usually trust people.",
    "I sometimes avoid doing hard work.",
    "I stay emotionally steady, even under pressure.",
    "I like inventing or creating things.",
    "I speak up and take the lead.",
    "I sometimes come off as cold or distant.",
    "I finish tasks even when they’re difficult.",
    "My mood can change quickly.",
    "I value art, music, or beauty in life.",
    "I sometimes feel shy or self-conscious.",
    "I try to be kind and considerate to others.",
    "I get things done efficiently.",
    "I stay calm in tough situations.",
    "I like having a predictable routine.",
    "I enjoy being around other people.",
    "I can be rude without meaning to.",
    "I like to make plans and follow through with them.",
    "I get nervous easily.",
    "I enjoy reflecting on ideas and possibilities.",
    "I’m not very interested in art or music.",
    "I like working together with others.",
    "I get distracted easily.",
    "I enjoy creative things like art, music, or writing.",
  ];

  const [responses, setResponses] = useState<Record<number, string>>({});
  const [unanswered, setUnanswered] = useState<number[]>([]);

  const handleResponseChange = (questionIndex: number, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  // Helper function to calculate Big Five results from responses
  const calculateBigFive = () => {
    const scoringKey = {
      Extraversion: [1, 6, 11, 16, 21, 26, 31, 36],
      Agreeableness: [2, 7, 12, 17, 22, 27, 32, 37, 42],
      Conscientiousness: [3, 8, 13, 18, 23, 28, 33, 38, 43],
      Neuroticism: [4, 9, 14, 19, 24, 29, 34, 39],
      Openness: [5, 10, 15, 20, 25, 30, 35, 40, 41, 44],
    };

    const reverseScored = new Set([6, 9, 12, 18, 21, 23, 24, 27, 31, 34, 35, 37, 41, 43]);

    const maxScores: Record<string, number> = {
      Extraversion: 40,
      Agreeableness: 45,
      Conscientiousness: 45,
      Neuroticism: 40,
      Openness: 50,
    };

    const scores: Record<string, number> = {
      Extraversion: 0,
      Agreeableness: 0,
      Conscientiousness: 0,
      Neuroticism: 0,
      Openness: 0,
    };

    for (const [trait, items] of Object.entries(scoringKey)) {
      let total = 0;
      for (const item of items) {
        const response = responses[item - 1];
        if (response) {
          const value = parseInt(response);
          total += reverseScored.has(item) ? 6 - value : value;
        }
      }
      const maxScore = maxScores[trait];
      scores[trait] = parseFloat((total / maxScore).toFixed(2));
    }

    return scores;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(responses).length !== 44) {
      const unansweredIndices = [];
      for (let i = 0; i < 44; i++) {
        if (!(i in responses)) {
          unansweredIndices.push(i);
        }
      }
      setUnanswered(unansweredIndices);
      return;
    }

    setUnanswered([]);

    const result = calculateBigFive();
    console.log("Big Five Results:", result);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No user is logged in.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        bigFivePersonality: result,
      });
      console.log("Big Five personality results updated in user profile.");
      navigate("/user-profile");
    } catch (error) {
      console.error("Failed to update Firestore:", error);
    }
  };

  const scaleOptions = [
    { value: "1", label: "Strongly Disagree" },
    { value: "2", label: "Disagree" },
    { value: "3", label: "Neutral" },
    { value: "4", label: "Agree" },
    { value: "5", label: "Strongly Agree" },
  ];

  const answeredCount = Object.keys(responses).length;
  const progressPercent = (answeredCount / 44) * 100;

  return (
    <AppPage>
      <div className="mb-8 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/user-profile")}
          aria-label="Back to profile"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <PageHeader
          margin="profile"
          title="Personality quiz"
          description="Rate how much you agree with each statement."
          className="mb-0 flex-1"
        />
      </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Brain className="mr-3 h-5 w-5 text-sage" />
              Personality assessment
            </CardTitle>
            <p className="text-chalk-2">
              Rate how much you agree with each statement about yourself
            </p>
          </CardHeader>

          <CardContent>
            {/* Progress Bar */}
            <div className="mb-4 sticky top-0 py-2 z-10">
              <div className="h-2 w-full rounded-full bg-recess">
                <div
                  className="h-2 rounded-full bg-sage transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="numeric mt-1 text-sm text-chalk-2">
                {answeredCount} / 44 answered
              </div>
            </div>

            {unanswered.length > 0 && (
              <p className="mb-4 text-clay">
                Please answer all questions. You missed: {unanswered.map(i => i+1).join(", ")}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {personalityTraits.map((trait, index) => (
                <div
                  key={index}
                  className={`space-y-4 rounded-notice border bg-recess p-6 ${
                    unanswered.includes(index) ? "border-clay" : "border-rule"
                  }`}
                >
                  <Label className="text-lg font-medium text-chalk">
                    {index + 1}. {trait}
                  </Label>

                  <RadioGroup
                    value={responses[index] || ""}
                    onValueChange={(value) =>
                      handleResponseChange(index, value)
                    }
                    className="grid grid-cols-1 md:grid-cols-5 gap-4"
                  >
                    {scaleOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2 rounded-control border border-rule bg-notice p-3 transition-all duration-200 hover:border-rule-strong"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`q${index}-${option.value}`}
                          className="transition-all duration-200"
                        />
                        <Label
                          htmlFor={`q${index}-${option.value}`}
                          className={`flex-1 cursor-pointer text-center text-sm transition-all duration-200 ${
                            responses[index] === option.value
                              ? "scale-105 font-semibold text-sage"
                              : "text-chalk-2 hover:scale-102"
                          }`}
                        >
                          <div className="font-medium">{option.value}</div>
                          <div className="mt-1 text-xs text-chalk-3">
                            {option.label}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <Button
                  type="submit"
                  size="lg"
                >
                  Complete assessment
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </AppPage>
  );
};

export default PersonalityQuiz;
