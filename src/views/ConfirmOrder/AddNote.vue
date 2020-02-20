<template>
    <div id="add-note">
        <top-bar show-back title="订单备注"/>
        <div class="quick-note">
            <h4>快速备注</h4>
            <ul>
                <li v-for="(quickNote,index) in quickNotes" :key="index">
                    <i v-for="(note,i) in quickNote"
                       :class="{first : i === 0, last: i === quickNote.length -1, checked: i === checkedNote[index]}"
                       :key="i"
                       @tap="handleTap(index,note,i)">{{note}}</i>
                </li>
            </ul>
        </div>
        <div class="custom-note">
            <h4>其他备注</h4>
            <textarea placeholder="请输入备注内容" v-model="customNote"></textarea>
        </div>
        <div class="confirm" @tap="confirm">确定</div>
    </div>
</template>

<script>
    import TopBar from '@/components/TopBar'
    import {getQuickNote} from '@/api/index'

    export default {
        name: "AddNote",
        components: {
            TopBar
        },
        data() {
            return {
                quickNotes: [],
                customNote: '',
                checkedNote: {}
            }
        },
        computed: {
            checkedNoteText() {
                let arr = [];
                Object.keys(this.checkedNote).forEach(((value, index, array) => {
                    arr.push(this.quickNotes[value][this.checkedNote[value]]);
                }));
                return arr.join('，');
            }
        },
        activated() {
            getQuickNote(this.$route.query.id, this.$route.query.sig).then(({data}) => {
                this.quickNotes = data.remarks;
            })
        },
        methods: {
            handleTap(index, text, i) {
                this.$set(this.checkedNote, index, i);
            },
            confirm() {
                this.$router.go(-1);
                this.$store.commit('setNote', {quickNote:this.checkedNoteText, customNote:this.customNote});
            }
        }
    }
</script>

<style lang="scss">
    @import '@/assets/css/mixin';

    #add-note {
        @include size(100%, 100%);
        @include absolute();
        padding-top: 1.95rem;
        box-sizing: border-box;

        .quick-note {
            background-color: #fff;
            margin-top: .4rem;
            padding: 0 .6rem 1rem;

            h4 {
                font-size: 0.65rem;
                color: #333;
                line-height: 2rem;
                font-weight: normal;
            }

            ul {
                @include flex();
                flex-wrap: wrap;

                li {
                    margin: 0 .6rem .6rem 0;

                    i {
                        font-size: 0.6rem;
                        color: #777;
                        padding: .3rem .6rem;
                        border: 0.025rem solid #777;
                        border-left: 0;
                    }

                    i.first {
                        border-left: 0.025rem solid #777;
                        border-top-left-radius: .2rem;
                        border-bottom-left-radius: .2rem;
                    }

                    i.last {
                        border-top-right-radius: .2rem;
                        border-bottom-right-radius: .2rem;
                    }

                    i.checked {
                        color: #fff;
                        border-color: #4cd964;
                        background-color: #4cd964;
                    }
                }
            }
        }

        .custom-note {
            background-color: #fff;
            margin-top: .4rem;
            padding: 0 .6rem 1rem;

            h4 {
                font-size: 0.65rem;
                color: #333;
                line-height: 2rem;
                font-weight: normal;
            }

            textarea {
                width: 100%;
                background-color: #f9f9f9;
                border: 0.025rem solid #eee;
                resize: none;
                min-height: 4.5rem;
                border-radius: .2rem;
                font-size: 0.6rem;
                color: #666;
                padding: .5rem;
                box-sizing: border-box;
            }
        }

        .confirm {
            background-color: #4cd964;
            font-size: 0.7rem;
            color: #fff;
            text-align: center;
            margin: .6rem .7rem 0;
            line-height: 1.8rem;
            border-radius: 0.2rem;
        }
    }
</style>