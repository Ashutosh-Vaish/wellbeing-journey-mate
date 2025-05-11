
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Resource {
  title: string;
  description: string;
  link?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const mentalHealthResources: Resource[] = [
  {
    title: "National Alliance on Mental Illness (NAMI)",
    description: "NAMI provides advocacy, education, support and public awareness so that all individuals and families affected by mental illness can build better lives.",
    link: "https://www.nami.org"
  },
  {
    title: "Mental Health America",
    description: "The nation's leading community-based nonprofit dedicated to addressing the needs of those living with mental illness.",
    link: "https://www.mhanational.org"
  },
  {
    title: "Crisis Text Line",
    description: "Text HOME to 741741 from anywhere in the USA to text with a trained Crisis Counselor.",
    link: "https://www.crisistextline.org"
  },
  {
    title: "National Suicide Prevention Lifeline",
    description: "Call 988 or 1-800-273-8255 available 24/7 for emotional support.",
    link: "https://988lifeline.org"
  }
];

const mindfulnessResources: Resource[] = [
  {
    title: "Mindful.org",
    description: "Offers information on mindfulness practices and their benefits.",
    link: "https://www.mindful.org"
  },
  {
    title: "Greater Good Science Center",
    description: "Science-based insights for a meaningful life, including research on mindfulness.",
    link: "https://greatergood.berkeley.edu"
  },
  {
    title: "UCLA Mindful Awareness Research Center",
    description: "Offers free guided meditations and information on mindfulness practices.",
    link: "https://www.uclahealth.org/marc"
  }
];

const bookResources: Resource[] = [
  {
    title: "The Anxiety and Phobia Workbook",
    description: "By Edmund Bourne - A practical guide with exercises to manage anxiety."
  },
  {
    title: "Feeling Good: The New Mood Therapy",
    description: "By David D. Burns - A classic self-help book based on cognitive behavioral therapy."
  },
  {
    title: "The Mindful Way Through Depression",
    description: "By Mark Williams, John Teasdale, Zindel Segal, and Jon Kabat-Zinn - A guide to using mindfulness to prevent depression relapse."
  }
];

const faqs: FAQ[] = [
  {
    question: "What is mindfulness?",
    answer: "Mindfulness is the practice of purposely focusing your attention on the present moment—and accepting it without judgment. It involves being aware of your thoughts, feelings, bodily sensations, and surrounding environment."
  },
  {
    question: "How can journaling help my mental health?",
    answer: "Journaling allows you to clarify your thoughts and feelings, know yourself better, reduce stress, solve problems more effectively, and resolve disagreements with others. Writing about stressful events helps you come to terms with them, reducing the impact these stressors have on your physical health."
  },
  {
    question: "What are affirmations and do they really work?",
    answer: "Affirmations are positive statements that can help you challenge and overcome self-sabotaging and negative thoughts. When repeated often, and with conviction, they can start to make positive changes to how you think and feel. Research suggests they may help by encouraging your brain to form new clusters of positive thought neurons."
  },
  {
    question: "How often should I practice breathing exercises?",
    answer: "For best results, try to practice breathing exercises for at least 5-10 minutes each day. You can start with shorter sessions and gradually work up to longer ones. Many people find it beneficial to practice in the morning to start their day with a clear mind, and in the evening to release the day's stress."
  },
  {
    question: "How long will it take to see improvements in my mental health?",
    answer: "Everyone's journey is different. Some people notice benefits from mindfulness practices and other mental health strategies within days or weeks, while for others it may take months of consistent practice. Be patient with yourself and celebrate small improvements along the way."
  }
];

const selfCareActivities: Resource[] = [
  {
    title: "Create a Self-Care Routine",
    description: "Develop a personalized self-care routine that includes activities you enjoy, such as reading, taking baths, walking in nature, or cooking."
  },
  {
    title: "Set Boundaries",
    description: "Practice saying no to requests that overwhelm you, and set healthy boundaries in your personal and professional relationships."
  },
  {
    title: "Digital Detox",
    description: "Take regular breaks from digital devices and social media to reduce stress and be more present."
  },
  {
    title: "Practice Gratitude",
    description: "Keep a gratitude journal or simply take a moment each day to acknowledge three things you're thankful for."
  },
  {
    title: "Get Moving",
    description: "Incorporate physical activity into your routine - even brief periods of movement can boost your mood and energy."
  }
];

const Resources: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Mental Health Resources</CardTitle>
          <CardDescription>
            Find help, support, and information about mental health.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="helplines">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="helplines">Helplines & Organizations</TabsTrigger>
              <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
            </TabsList>
            
            <TabsContent value="helplines" className="space-y-4 pt-4">
              {mentalHealthResources.map((resource, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-base">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-5">
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                  {resource.link && (
                    <CardFooter className="pt-2 pb-4 px-5">
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 text-sm underline"
                      >
                        Visit Website
                      </a>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="mindfulness" className="space-y-4 pt-4">
              {mindfulnessResources.map((resource, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-base">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-5">
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                  {resource.link && (
                    <CardFooter className="pt-2 pb-4 px-5">
                      <a 
                        href={resource.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 text-sm underline"
                      >
                        Visit Website
                      </a>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="books" className="space-y-4 pt-4">
              {bookResources.map((resource, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="py-4 px-5">
                    <CardTitle className="text-base">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-5">
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Self-Care Activities</CardTitle>
          <CardDescription>
            Suggestions for incorporating self-care into your daily life.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selfCareActivities.map((activity, index) => (
            <div key={index} className="pb-3 border-b last:border-b-0 last:pb-0">
              <h3 className="font-medium">{activity.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Answers to common questions about mental health and wellness.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground text-center">
            Remember that this app is not a substitute for professional mental health care. 
            If you're experiencing serious emotional distress, please reach out to a healthcare provider.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Resources;
