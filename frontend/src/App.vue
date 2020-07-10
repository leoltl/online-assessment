<template>
  <div class="app">
    <div class="wrapper">
      <SearchBox 
        :id="'name-input'"
        :type="'name'"
        v-on:searchTermChange="handleSearchBoxChange"
      />
      <SearchBox 
        :id="'tag-input'"
        :type="'tag'"
        v-on:searchTermChange="handleSearchBoxChange"
      />
      <Student 
        v-for="student in matchingStudents" 
        :key="`${student.id}-${student.tags.length}`" 
        :student="student" 
        v-on:addTag="handleAddTag"
      />
    </div>
  </div>
</template>

<script>
import { tagBus } from "./Eventbus";
import Student from "./components/Student.vue";
import SearchBox from "./components/SearchBox";
export default {
  name: 'App',
  components: {
    Student,
    SearchBox
  },
  data() {
    return {
      students: null,
      nameSearchTerm: "",
      tagSearchTerm: "",
    }
  },
  methods: {
    handleAddTag(payload) {
      this.students.forEach(student => {
        if (student.id === payload.id) {
          // ignore if same tag has been added
          if (student.tags.some(tag => new RegExp(tag, "i").test(payload.tag))) return
          this.$set(student.tags, student.tags.length, payload.tag)
        }
      })
    },
    handleSearchBoxChange(val, type) {
      switch(type) {
        case "name":
          this.nameSearchTerm = val;
          break;
        case "tag":
          this.tagSearchTerm = val;
          break;
      }
    }
  },
  async mounted() {
    let res = await fetch("https://www.hatchways.io/api/assessment/students")
    this.students = (await res.json())["students"]
    this.students = this.students.map((student) => { 
      // add full name and an empty array to student as props for search by name and tag function
      student.fullName = `${student.firstName} ${student.lastName}`
      student.tags = []
      return student
    });
  },
  created() {
    tagBus.$on("addTag", this.handleAddTag);
  },
  computed: {
    matchingStudents() {
      if (this.nameSearchTerm === "" && this.tagSearchTerm === "") return this.students
      const searchByName = new RegExp(this.nameSearchTerm, "i");
      const searchByTag = new RegExp(this.tagSearchTerm, "i");
      return this.students.filter(student => {
        const isNameMatch = searchByName.test(student.fullName);
        const isTagMatch = student.tags.some(tag => searchByTag.test(tag));
        return (
          // keep when both name and tags matches the student
          isNameMatch && isTagMatch || 
          // keep when only search for student's name
          this.tagSearchTerm === "" && isNameMatch || 
          // keep when only search for students' tags
          this.nameSearchTerm === "" && isTagMatch
        )
      });
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
.app {
  background: #eee;
  padding: 20vh 20vw
}

.wrapper {
  background: white;
  height: 60vh;
  width: 60vw;
  overflow: scroll;
  scrollbar-width: none;
  border-radius: 7px;
  box-shadow: 2px 2px #ddd
}

input {
  box-sizing: border-box;
  border: none;
  border-bottom: 3px solid black;
  margin: 0.5rem;
  padding: 0.3rem;
  width: calc(100% - 1rem);
}
</style>
