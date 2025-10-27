#include <stdio.h>
#include <stdlib.h>

int cmp(const void *a, const void *b){ return *(int*)a - *(int*)b; }

int main() {
    int nums[1000], n=0;
    while(scanf("%d", &nums[n]) != EOF) n++;
    qsort(nums, n, sizeof(int), cmp);

    printf("[");
    int first=1;
    for(int i=0;i<n-2;i++){
        if(i>0 && nums[i]==nums[i-1]) continue;
        int left=i+1, right=n-1;
        while(left<right){
            int sum=nums[i]+nums[left]+nums[right];
            if(sum==0){
                if(!first) printf(","); first=0;
                printf("[%d,%d,%d]", nums[i], nums[left], nums[right]);
                int tmpL=nums[left], tmpR=nums[right];
                while(left<right && nums[left]==tmpL) left++;
                while(left<right && nums[right]==tmpR) right--;
            } else if(sum<0) left++;
            else right--;
        }
    }
    printf("]");
    return 0;
}
