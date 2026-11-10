import { Course, StudentProfile, DegreePlan, RecommendationMatch } from '../types';

export function calculateCourseRecommendations(
  courses: Course[],
  profile: StudentProfile,
  degreePlan: DegreePlan
): RecommendationMatch[] {
  const completedSet = new Set(profile.completedCourseIds);

  // Determine what requirements are currently completed vs needed
  const unfulfilledCategoryCourseIds = new Set<string>();
  degreePlan.categories.forEach((cat) => {
    let completedCreditsInCat = 0;
    cat.eligibleCourseIds.forEach((cId) => {
      if (completedSet.has(cId)) {
        const c = courses.find((course) => course.id === cId);
        if (c) completedCreditsInCat += c.credits;
      }
    });

    if (completedCreditsInCat < cat.requiredCredits) {
      cat.eligibleCourseIds.forEach((cId) => unfulfilledCategoryCourseIds.add(cId));
    }
  });

  return courses
    .filter((course) => !completedSet.has(course.id)) // Only recommend courses not yet completed
    .map((course) => {
      let score = 40; // baseline
      const matchReasons: string[] = [];

      // 1. Interest Tag Alignment (up to +30 pts)
      const matchingInterests = course.interestTags.filter((tag) =>
        profile.interestTags.some(
          (userTag) => userTag.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(userTag.toLowerCase())
        )
      );

      if (matchingInterests.length > 0) {
        const interestBonus = Math.min(28, matchingInterests.length * 9);
        score += interestBonus;
        matchReasons.push(`Directly matches your interest in ${matchingInterests.slice(0, 2).join(' & ')}`);
      }

      // 2. Career Goal Alignment (up to +20 pts)
      const matchingCareers = course.careerTags.filter((career) =>
        profile.careerGoals.some(
          (goal) =>
            goal.toLowerCase().includes(career.toLowerCase()) || career.toLowerCase().includes(goal.toLowerCase())
        )
      );

      let careerAlignment = 'Broad professional development';
      if (matchingCareers.length > 0) {
        score += 18;
        careerAlignment = `Prepares you for ${matchingCareers[0]} roles`;
        matchReasons.push(`Builds core competencies for your ${matchingCareers[0]} career target`);
      }

      // 3. Degree Requirement Fit (up to +22 pts)
      let requirementImpact = 'General Elective / Interdisciplinary Breadth';
      const isUnfulfilledDegreeCourse = unfulfilledCategoryCourseIds.has(course.id);
      const degreeFulfillments = course.fulfills.filter((f) => f.majorIds.includes(profile.majorId));

      if (degreeFulfillments.length > 0) {
        const primaryFulfillment = degreeFulfillments[0];
        if (primaryFulfillment.category === 'core') {
          score += 22;
          requirementImpact = `Fulfills Essential ${degreePlan.majorName} Core Requirement (${course.credits} cr)`;
          matchReasons.push(`Satisfies mandatory ${degreePlan.majorName} graduation core`);
        } else if (primaryFulfillment.category === 'specialization') {
          score += 18;
          requirementImpact = `Advances ${degreePlan.majorName} Upper-Division Specialization (${course.credits} cr)`;
          matchReasons.push(`Accelerates upper-level major concentration`);
        } else if (primaryFulfillment.category === 'capstone') {
          score += 15;
          requirementImpact = `Senior Capstone Requirement (${course.credits} cr)`;
          matchReasons.push(`Senior capstone deliverable sequence`);
        } else if (primaryFulfillment.category === 'gened') {
          score += 12;
          requirementImpact = `Fulfills General Education Distribution [${primaryFulfillment.genEdCategory || 'Breadth'}]`;
          matchReasons.push(`Clears General Education distribution requirements`);
        }
      } else if (isUnfulfilledDegreeCourse) {
        score += 10;
        requirementImpact = 'Applicable towards open degree category';
      }

      // 4. Work Style Alignment (up to +15 pts)
      const prefersProjects = profile.workStyle.projectVsExam >= 50;
      let workloadFitNote = 'Balanced coursework format';
      if (prefersProjects && course.workload.projects >= 65) {
        score += 10;
        workloadFitNote = `Strong project-based structure (${course.workload.projects}% projects), matching your study preference`;
        matchReasons.push('Portfolio-focused project assignments with low high-stakes exam weight');
      } else if (!prefersProjects && course.workload.exams >= 60) {
        score += 8;
        workloadFitNote = `Traditional structured exam format (${course.workload.exams}% exams), matching your study preference`;
      }

      // 5. Prerequisite Readiness
      const hasUnmetPrereq = course.prerequisites.some((prereqId) => !completedSet.has(prereqId));
      if (hasUnmetPrereq) {
        score -= 15; // penalty if student hasn't completed prerequisites yet
        matchReasons.push(`Note: Requires prerequisite (${course.prerequisiteCodes.join(', ')})`);
      } else {
        score += 8; // bonus for being immediately eligible to enroll!
        matchReasons.push('All prerequisites satisfied — ready for immediate enrollment');
      }

      // 6. Student Course Rating Bonus
      if (course.averageRating >= 4.7) {
        score += 6;
      }

      // Clamp score between 20 and 99
      const finalScore = Math.max(20, Math.min(99, Math.round(score)));

      return {
        course,
        matchScore: finalScore,
        matchReasons: matchReasons.slice(0, 3),
        requirementImpact,
        careerAlignment,
        workloadFitNote,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
