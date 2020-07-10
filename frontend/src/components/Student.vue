<template>
  <div class="student">
    <div class="profile-image">
      <img :src="student.pic" alt="student profile image"/>
    </div>
    <div class="student-detail">
      <h2>{{ student.firstName }} {{ student.lastName }}</h2>
      <p> Email: {{ student.email }} </p>
      <p> Company: {{ student.company }} </p>
      <p> Skill: {{ student.skill }} </p>
      <p> Average: {{ this.averageScore }}% </p>
      <template v-if="expanded">
        <br />
        <p v-for="(grade, index) in student.grades" :key="index">
          Test {{index + 1}}: {{grade}}% 
        </p>
        <Tagging :studentID="student.id" :tags="student.tags"/>
      </template>
    </div>
    
    <div 
      class="expand-btn" 
      role="button" 
      :aria-pressed="expanded ? 'true' : 'false'" 
      v-on:click="toggle" >
    {{ expanded ? "-" : "+" }}
    </div>
  </div>
</template>

<script>
import Tagging from "./Tagging.vue"
export default {
  name: 'Student',
  props: ["student"],
  components: {
    Tagging
  },
  data() {
    return {
      expanded: false,
    }
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded
    },
  },
  computed: {
    averageScore: function() {
      const sum = this.student.grades.reduce((sum, current) => sum + parseInt(current), 0)
      return (sum / this.student.grades.length)
    }
  }
}
</script>

<style scoped>
.student {
  border-bottom: 0.5px solid lightgrey;
  display: flex;
  position: relative;
}

.expand-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 2rem;
  font-weight: bolder;
  cursor: pointer;
}

.profile-image {
  padding: 1rem;
  padding-right: 3rem;
}

.profile-image img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid black;
}

.student-detail p {
  transform: translate(20px);
}

.student-detail h2 {
  text-transform: uppercase;
}
</style>