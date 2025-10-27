#include <bits/stdc++.h>
using namespace std;

int main() {
    vector<int> nums;
    int x;
    while(cin >> x) nums.push_back(x);
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;

    for(int i=0;i<nums.size()-2;i++){
        if(i>0 && nums[i]==nums[i-1]) continue;
        int left=i+1, right=nums.size()-1;
        while(left<right){
            int sum=nums[i]+nums[left]+nums[right];
            if(sum==0){
                res.push_back({nums[i], nums[left], nums[right]});
                while(left<right && nums[left]==nums[left+1]) left++;
                while(left<right && nums[right]==nums[right-1]) right--;
                left++; right--;
            } else if(sum<0){
                left++;
            } else right--;
        }
    }

    cout << "[";
    for(size_t i=0;i<res.size();i++){
        cout << "[" << res[i][0] << "," << res[i][1] << "," << res[i][2] << "]";
        if(i!=res.size()-1) cout << ",";
    }
    cout << "]";
    return 0;
}
