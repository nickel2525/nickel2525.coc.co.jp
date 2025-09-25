const API_URL = "https://gemini-api-app-663810886864.us-central1.run.app/generate";
        
        let manualResults = null;
        let randomResults = null;

        // プルダウンメニューを生成する関数
        function populateDropdowns() {
            const num1to5 = document.querySelectorAll('#manualModeContainer #num1, #manualModeContainer #num2, #manualModeContainer #num3, #manualModeContainer #num4, #manualModeContainer #num5');
            populateRange(num1to5, 3, 18);
            const num6_7 = document.querySelectorAll('#manualModeContainer #num6, #manualModeContainer #num7');
            populateRange(num6_7, 8, 18);
            const num8 = document.querySelectorAll('#manualModeContainer #num8');
            populateRange(num8, 6, 21);
            
            const allDropdowns = document.querySelectorAll('#manualModeContainer select');
            allDropdowns.forEach(dropdown => {
                if (dropdown.id !== 'age_select_dropdown') {
                    dropdown.value = 10;
                }
            });

            const ageDropdown = document.getElementById('age_select_dropdown');
            for (let i = 15; i <= 60; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.text = i;
                ageDropdown.appendChild(option);
            }
        }

        function populateRange(elements, start, end) {
            elements.forEach(dropdown => {
                dropdown.innerHTML = '';
                for (let i = start; i <= end; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.text = i;
                    dropdown.appendChild(option);
                }
            });
        }

        // ページ読み込み時に実行
        document.addEventListener('DOMContentLoaded', populateDropdowns);
        
        // 追加情報トグルのためのイベントリスナー
        document.getElementById('toggleButton').addEventListener('click', function() {
            const additionalInfo = document.getElementById('additionalInfo');
            const toggleIcon = document.getElementById('toggleIcon');
            additionalInfo.classList.toggle('hidden');
            if (additionalInfo.classList.contains('hidden')) {
                toggleIcon.textContent = '+';
            } else {
                toggleIcon.textContent = '-';
            }
        });

        // 年齢ラジオボタンの変更を監視
        document.getElementById('age_select').addEventListener('change', function() {
            document.getElementById('age_select_dropdown').disabled = false;
        });

        document.getElementById('age_none').addEventListener('change', function() {
            document.getElementById('age_select_dropdown').disabled = true;
        });

        // 性格チェックボックスの変更を監視し、最大3つに制限する
        document.querySelectorAll('input[name="personality_type"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const checkedBoxes = document.querySelectorAll('input[name="personality_type"]:checked');
                if (checkedBoxes.length > 3) {
                    this.checked = false;
                }
            });
        });

        // モード切り替えロジック
        document.getElementById('manualModeButton').addEventListener('click', () => {
            showManualMode();
        });

        document.getElementById('randomModeButton').addEventListener('click', () => {
            showRandomMode();
        });

        function showManualMode() {
            document.getElementById('manualModeContainer').classList.remove('hidden');
            document.getElementById('randomModeContainer').classList.add('hidden');
            document.getElementById('manualModeButton').classList.remove('bg-slate-700', 'text-slate-400');
            document.getElementById('manualModeButton').classList.add('bg-indigo-600', 'text-white');
            document.getElementById('randomModeButton').classList.remove('bg-indigo-600', 'text-white');
            document.getElementById('randomModeButton').classList.add('bg-slate-700', 'text-slate-400');
            
            if (manualResults) {
                renderResults(manualResults, 'manual');
            } else {
                clearResults();
            }
        }
        
        function showRandomMode() {
            document.getElementById('manualModeContainer').classList.add('hidden');
            document.getElementById('randomModeContainer').classList.remove('hidden');
            document.getElementById('randomModeButton').classList.remove('bg-slate-700', 'text-slate-400');
            document.getElementById('randomModeButton').classList.add('bg-indigo-600', 'text-white');
            document.getElementById('manualModeButton').classList.remove('bg-indigo-600', 'text-white');
            document.getElementById('manualModeButton').classList.add('bg-slate-700', 'text-slate-400');

            if (randomResults) {
                renderResults(randomResults, 'random');
            } else {
                clearResults();
            }
        }


        function clearResults() {
            document.getElementById('randomValuesDisplay').classList.add('hidden');
            document.getElementById('randomValuesDisplay').innerHTML = '';
            document.getElementById('tab1').textContent = '';
            document.getElementById('tab2').textContent = '';
            document.getElementById('tab3').textContent = '';
            document.getElementById('tabButtons').classList.add('hidden');
            document.getElementById('tabs').style.display = 'none';
        }

        function rollDice(sides) {
            return Math.floor(Math.random() * sides) + 1;
        }

        function generateRandomAge() {
            const minAge = 15;
            const maxAge = 60;
            const peakStart = 18;
            const peakEnd = 25;

            let age;
            let found = false;
            while (!found) {
                const r1 = Math.random();
                const r2 = Math.random();
                const r3 = Math.random();
                const averageR = (r1 + r2 + r3) / 3;

                const range = maxAge - minAge;
                age = Math.floor(minAge + range * averageR);

                if (age >= peakStart && age <= peakEnd) {
                    found = true;
                } else {
                    const distFromPeak = Math.min(Math.abs(age - peakStart), Math.abs(age - peakEnd));
                    const probability = Math.pow(0.8, distFromPeak / 5);
                    if (Math.random() < probability) {
                        found = true;
                    }
                }
            }
            return age;
        }

        function generateRandomData() {
            const genders = ['male', 'female'];
            const personalities = [
                'ポジティブ', 'ネガティブ', '慎重', '大胆', '繊細', '寡黙', '短気', '冷静', '高貴', 
                '陽気', '陰気', '楽観的', '真面目', '優しい', '厳しい', '努力家', '怒りっぽい', 
                '穏やか', '気が強い', '好奇心旺盛', '負けず嫌い', 'マイペース', '正義感が強い', 
                '人気者', '臆病', '神経質', 'フレンドリー'
            ];
            
            // 3つのユニークな性格をランダムに選択
            const selectedPersonalities = [];
            while (selectedPersonalities.length < 3) {
                const randomIndex = Math.floor(Math.random() * personalities.length);
                const personality = personalities[randomIndex];
                if (!selectedPersonalities.includes(personality)) {
                    selectedPersonalities.push(personality);
                }
            }
            
            return {
                num1: rollDice(6) + rollDice(6) + rollDice(6),
                num2: rollDice(6) + rollDice(6) + rollDice(6),
                num3: rollDice(6) + rollDice(6) + rollDice(6),
                num4: rollDice(6) + rollDice(6) + rollDice(6),
                num5: rollDice(6) + rollDice(6) + rollDice(6),
                num6: rollDice(6) + rollDice(6) + 6,
                num7: rollDice(6) + rollDice(6) + 6,
                num8: rollDice(6) + rollDice(6) + rollDice(6) + 3,
                age: generateRandomAge(),
                gender: genders[Math.floor(Math.random() * genders.length)],
                text: selectedPersonalities.join(', ')
            };
        }

        function renderRandomValues(randomData) {
            const displayContainer = document.getElementById('randomValuesDisplay');
            const dataMap = {
                'STR(筋力): 3D6': randomData.num1,
                'CON(体力): 3D6': randomData.num2,
                'POW(精神力): 3D6': randomData.num3,
                'DEX(敏捷性): 3D6': randomData.num4,
                'APP(外見): 3D6': randomData.num5,
                'SIZ(体格): 2D6+6': randomData.num6,
                'INT(知性): 2D6+6': randomData.num7,
                'EDU(教育): 3D6+3': randomData.num8,
                '年齢': randomData.age,
                '性別': randomData.gender === 'male' ? '男性' : (randomData.gender === 'female' ? '女性' : '指定なし'),
                '性格': randomData.text
            };

            let htmlContent = '<h3 class="text-lg md:text-xl font-semibold text-slate-400 mb-2">生成された能力値</h3>';
            htmlContent += '<div class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">';
            for (const key in dataMap) {
                htmlContent += `
                    <div class="flex flex-col">
                        <span class="text-xs font-medium text-slate-500">${key}</span>
                        <span class="text-sm font-bold text-indigo-300">${dataMap[key]}</span>
                    </div>
                `;
            }
            htmlContent += '</div>';

            displayContainer.innerHTML = htmlContent;
            displayContainer.classList.remove('hidden');
        }
        
        // JSONデータを基に整形されたHTMLを生成するヘルパー関数
        function createProfileHtml(profile) {
            // スキルリストのHTMLを生成する内部関数
            const createSkillsList = (skills) => {
                let skillsHtml = '<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">';
                skills.forEach(skill => {
                    const parts = skill.split(':');
                    const skillName = parts[0].trim();
                    const skillValue = parts[1] ? parts[1].trim() : '';
                    skillsHtml += `<div class="text-sm"><span class="text-slate-400">${skillName}:</span> <span class="font-semibold text-indigo-300">${skillValue}</span></div>`;
                });
                skillsHtml += '</div>';
                return skillsHtml;
            };

            // 趣味セクションのHTMLを生成
            let hobbiesHtml = '';
            if (profile.趣味) {
                Object.entries(profile.趣味).forEach(([key, value]) => {
                    hobbiesHtml += `
                        <div class="mt-3">
                            <h4 class="font-semibold text-slate-300">${key}</h4>
                            <p class="text-slate-400 text-sm leading-relaxed">${value}</p>
                        </div>
                    `;
                });
            }

            const keySkillsHtml = profile.ポイントを振った技能 && profile.ポイントを振った技能.length > 0 ? createSkillsList(profile.ポイントを振った技能) : '<p class="text-slate-500 text-sm">該当なし</p>';
            const allSkillsHtml = profile.すべての技能 && profile.すべての技能.length > 0 ? createSkillsList(profile.すべての技能) : '<p class="text-slate-500 text-sm">該当なし</p>';

            return `
                <div class="space-y-5">
                    <div>
                        <h2 class="text-2xl font-bold text-indigo-400">${profile.名前 || 'N/A'}</h2>
                        <p class="text-lg text-slate-400 font-medium -mt-1">${profile.職業 || 'N/A'}</p>
                    </div>

                    <div>
                        <h3 class="text-base font-semibold text-slate-300 uppercase tracking-wider">バックグラウンド</h3>
                        <div class="mt-2 p-3 bg-slate-800 rounded-md ring-1 ring-slate-700">
                           <p class="text-slate-400 leading-relaxed text-sm">${profile.バックグラウンド || 'N/A'}</p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-base font-semibold text-slate-300 uppercase tracking-wider">趣味</h3>
                         <div class="mt-2 p-3 bg-slate-800 rounded-md ring-1 ring-slate-700">
                            ${hobbiesHtml || '<p class="text-slate-500 text-sm">該当なし</p>'}
                         </div>
                    </div>

                    <div>
                        <h3 class="text-base font-semibold text-slate-300 uppercase tracking-wider">ポイントを振った技能</h3>
                        <div class="mt-2 p-3 bg-slate-800 rounded-md ring-1 ring-slate-700">
                            ${keySkillsHtml}
                        </div>
                    </div>
                    
                    <div>
                        <details class="group bg-slate-800 rounded-md ring-1 ring-slate-700">
                            <summary class="cursor-pointer list-none flex justify-between items-center p-3 text-base font-semibold text-slate-300 hover:text-indigo-400 transition-colors">
                                すべての技能
                                <span class="text-indigo-400 text-lg transform transition-transform duration-200 group-open:rotate-90">&#9654;</span>
                            </summary>
                            <div class="px-3 pb-3 border-t border-slate-700 mt-2 pt-3">
                                ${allSkillsHtml}
                            </div>
                        </details>
                    </div>
                </div>
            `;
        }

        function renderResults(data, mode) {
            try {
                // 以前の結果をクリアし、新しいデータを解析して表示
                data.texts.forEach((text, index) => {
                    const tabId = `tab${index + 1}`;
                    const tabElement = document.getElementById(tabId);
                    if (tabElement) {
                        const profileData = JSON.parse(text);
                        tabElement.innerHTML = createProfileHtml(profileData);
                    }
                });
            } catch (error) {
                console.error("プロファイルデータの解析に失敗しました:", error);
                // UIにエラーメッセージを表示
                const errorMessage = `<p class="text-red-400">プロファイルの解析中にエラーが発生しました。データが正しいJSON形式であることを確認してください。</p>`;
                document.getElementById('tab1').innerHTML = errorMessage;
                document.getElementById('tab2').innerHTML = '';
                document.getElementById('tab3').innerHTML = '';
            }

            if (mode === 'random') {
                renderRandomValues(data.inputData);
            } else {
                document.getElementById('randomValuesDisplay').classList.add('hidden');
            }

            document.getElementById('loading').classList.add('hidden');
            document.getElementById('tabs').style.display = 'block';
            document.getElementById('tabButtons').classList.remove('hidden');
            showTab(0);
        }

        async function callApi(mode) {
            let dataToSend;
            
            const loadingElement = document.getElementById('loading');
            loadingElement.classList.remove('hidden');
            clearResults();

            if (mode === 'manual') {
                const ageSelect = document.getElementById('age_select_dropdown');
                const ageNone = document.getElementById('age_none');
                const personalities = Array.from(document.querySelectorAll('input[name="personality_type"]:checked')).map(cb => cb.id.replace('personality_', ''));

                dataToSend = {
                    num1: document.getElementById('num1').value,
                    num2: document.getElementById('num2').value,
                    num3: document.getElementById('num3').value,
                    num4: document.getElementById('num4').value,
                    num5: document.getElementById('num5').value,
                    num6: document.getElementById('num6').value,
                    num7: document.getElementById('num7').value,
                    num8: document.getElementById('num8').value,
                    age: ageNone.checked ? '指定なし' : ageSelect.value,
                    gender: document.querySelector('input[name="gender_type"]:checked').value,
                    text: personalities.length > 0 ? personalities.join(', ') : ''
                };
            } else { // 'random' mode
                dataToSend = generateRandomData();
            }

            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });

                if (!response.ok) {
                    throw new Error(`API呼び出しエラー: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                
                const resultData = {
                    texts: data.texts,
                    inputData: dataToSend
                };

                if (mode === 'manual') {
                    manualResults = resultData;
                } else {
                    randomResults = resultData;
                }

                renderResults(resultData, mode);
            } catch (error) {
                loadingElement.textContent = `エラー: ${error.message}`;
            }
        }

        function showTab(index) {
            const tabs = document.querySelectorAll('.tab-content');
            const buttons = document.querySelectorAll('.tab-button');
            
            tabs.forEach((tab, i) => {
                if (i === index) {
                    tab.classList.remove('hidden');
                } else {
                    tab.classList.add('hidden');
                }
            });

            buttons.forEach((button, i) => {
                if (i === index) {
                    button.classList.remove('bg-slate-700', 'text-slate-400', 'hover:bg-slate-600', 'hover:text-white');
                    button.classList.add('bg-indigo-500', 'text-white');
                } else {
                    button.classList.remove('bg-indigo-500', 'text-white');
                    button.classList.add('bg-slate-700', 'text-slate-400', 'hover:bg-slate-600', 'hover:text-white');
                }
            });
        }